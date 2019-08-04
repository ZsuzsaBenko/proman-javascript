import {dom} from "./dom.js";
import {dataHandler} from "./data_handler.js";

export let templates = {
    createBoardElement: function (boardTitle, boardStatuses, boardId, username, userId) {
        let fullContent = document.querySelector('#full-content');
        let state = localStorage.getItem("state");
        let board = document.createElement('div');
        board.classList.add('board');
        board.dataset.boardId = boardId;
        board.dataset.userId = userId;

        let boardHeader = templates.createBoardHeader(boardTitle, boardId, state);
        if (state === "loggedIn") {
            let newCardButton = templates.createNewCardButton();
            boardHeader.appendChild(newCardButton);
            newCardButton.addEventListener('click', function(event) {
                templates.handleNewCardButtonClick(event);
            });

            let deleteBoardButton = templates.createDeleteBoardButton();
            boardHeader.appendChild(deleteBoardButton);
            deleteBoardButton.addEventListener("click", function(event) {
                templates.handleDeleteButtonClick(event);
            });
        }

        let boardBody = templates.createBoardBody(boardStatuses, boardId, state);
        if (state === "loggedIn") {
            templates.dragAndDropCards(boardBody, boardHeader);
        }

        let boardFooter = templates.createBoardFooter(state, username);

        board.appendChild(boardHeader);
        boardHeader.addEventListener('click', dom.toggleBoard);
        board.appendChild(boardBody);
        board.appendChild(boardFooter);
        fullContent.appendChild(board);
    },
    createBoardHeader: function (boardTitle, boardId, state) {
        let boardHeader = document.createElement("div");
        boardHeader.classList.add('board-header');
        boardHeader.innerHTML = `
            <div class="board-title">${boardTitle}</div>
            <i class="fas fa-caret-up"></i>
            `;

        boardHeader.dataset.tableIsOpen = 'true';
        if (state === "loggedIn") {
            templates.editBoardTitle(boardHeader, boardId);
        }

        return boardHeader
    },
    editBoardTitle: function (boardHeader, boardId) {
        let title = boardHeader.querySelector('.board-title');
        title.dataset.boardTitle = title.innerHTML;

        title.addEventListener('click', function () {
            title.setAttribute('contentEditable', 'true');
        });
        title.addEventListener('keydown', function (event) {
            let enterKey = 13;
            let escKey = 27;
            if (event.which === enterKey) {
                title.setAttribute('contentEditable', 'false');
                title.dataset.boardTitle = title.innerHTML;
                dataHandler.updateBoard(boardId, title.dataset.boardTitle);
            }
            if (event.which === escKey) {
                title.setAttribute('contentEditable', 'false');
                title.innerHTML = title.dataset.boardTitle;
            }
        });
    },
    createNewCardButton: function() {
        let newCardButton = document.createElement('button');
        newCardButton.classList.add('new-card-button');
        newCardButton.innerHTML = 'Add New Card';
        return newCardButton
    },
    handleNewCardButtonClick: function(event) {
        let boardButton = event.currentTarget;
        let board = boardButton.parentNode.parentNode;
        let boardId = board.dataset.boardId;
        let firstColumn = document.querySelector(`.board[data-board-id="${boardId}"] .cards > :first-child`);
        const orderNumber = (firstColumn.children.length) + 1;
        dataHandler.saveNewCard(boardId, orderNumber);
    },
    createDeleteBoardButton: function() {
        let deleteBoardButton = document.createElement('button');
        deleteBoardButton.classList.add('delete-board-button');
        deleteBoardButton.innerHTML = 'Delete Board';
        return deleteBoardButton
    },
    handleDeleteButtonClick: function(event) {
        let deleteButton = event.currentTarget;
        let board = deleteButton.parentNode.parentNode;
        let boardId = board.dataset.boardId;
        dataHandler.deleteBoard(boardId);
    },
    createBoardBody: function(boardStatuses, boardId, state) {
        let boardBody = document.createElement("div");
        boardBody.classList.add('board-body');

        let table = document.createElement('table');
        table.classList.add('board-data');
        let tableHeader = templates.createTableHeader(boardStatuses, boardId, state);
        let tableBody = templates.createTableBody(boardStatuses);
        table.appendChild(tableHeader);
        table.appendChild(tableBody);

        boardBody.appendChild(table);
        return boardBody
    },
    createTableHeader: function (boardStatuses, boardId, state) {
        let tableHeader = document.createElement('tr');
        tableHeader.classList.add('statuses');
        for (const status of boardStatuses) {
            let cell = document.createElement('th');
            cell.innerHTML = `${status}`;
            cell.dataset.cellTitle = cell.innerHTML;
            if (state === "loggedIn") {
                templates.editTableHeader(cell, boardStatuses, boardId);
            }
            tableHeader.appendChild(cell);
        }
        return tableHeader
    },
    editTableHeader: function(cell, boardStatuses, boardId) {
        cell.addEventListener('click', function () {
            cell.setAttribute('contentEditable', 'true');
        });
        cell.addEventListener('keydown', function (event) {
            const enterKey = 13;
            const escKey = 27;
            if (event.which === enterKey) {
                let cellId = boardStatuses.indexOf(cell.dataset.cellTitle);
                cell.setAttribute('contentEditable', 'false');
                cell.dataset.cellTitle = cell.innerHTML;
                boardStatuses[cellId] = cell.dataset.cellTitle;
                let newStatuses = boardStatuses.toString();
                dataHandler.updateStatuses(newStatuses, boardId);
            }
            if (event.which === escKey) {
                cell.setAttribute('contentEditable', 'false');
                cell.innerHTML = cell.dataset.cellTitle;
            }
        });
    },
    createTableBody: function(boardStatuses) {
        let tableBody = document.createElement('tr');
        tableBody.classList.add('cards');
        for (let i = 0; i < boardStatuses.length; i++) {
            let cell = document.createElement('td');
            cell.dataset.status = `${i + 1}`;
            tableBody.appendChild(cell);
        }
        return tableBody
    },
    createCardElement: function(cardTitle, cardId, orderNum, state) {
        let cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute("data-order", orderNum);
        cardElement.innerHTML = `<p>${cardTitle}</p>`;

        if (state === "loggedIn") {
            cardElement.innerHTML = `<p>${cardTitle}</p>
                                 <p><i class="fas fa-trash-alt" title="Delete Card"></i></p>`;
            templates.editCardTitle(cardElement, cardId);
            templates.createCardTrash(cardElement);
        }

        return cardElement;
    },
    editCardTitle: function(cardElement, cardId) {
        let firstPara = cardElement.querySelector("p:first-child");
        cardElement.dataset.cardTitle = firstPara.innerHTML;
        firstPara.addEventListener('click', function (event) {
            let card = event.target;
            card.contentEditable = true;
        });

        cardElement.addEventListener('keydown', function (event) {
            const enterKey = 13;
            const escKey = 27;
            let card = event.target;
            if (event.which === enterKey) {
                card.contentEditable = false;
                cardElement.dataset.cardTitle = firstPara.innerHTML;
                dataHandler.updateCard(cardId, cardElement.dataset.cardTitle);
            }
            if (event.which === escKey) {
                card.contentEditable = false;
                firstPara.innerHTML = cardElement.dataset.cardTitle;
            }
        });
        cardElement.dataset.cardId = cardId;
    },
    createCardTrash: function(cardElement) {
        let trash = cardElement.querySelector(".fa-trash-alt");
        trash.addEventListener("click", function (event) {
            let clickedTrash = event.target;
            if (clickedTrash.classList.contains("fa-trash-alt")) {
                let clickedCardId = clickedTrash.parentNode.parentNode.dataset.cardId;
                dataHandler.deleteCard(clickedCardId);
            }
        });
    },
    dragAndDropCards: function(boardBody, boardHeader) {
        let classNames = boardBody.getElementsByTagName('td');
        let dragSelector = Array.from(classNames);
        dragula(dragSelector).on("drop", function (element, target, source) {
            boardBody.style.height = `auto`;
            for (let i = 0; i < source.childNodes.length; i++) {
                let card = source.childNodes[i];
                let cardOrderId = i + 1;
                card.dataset.order = `${cardOrderId}`;
                let status = source.dataset.status;
                let cardId = card.dataset.cardId;
                let data = {order: cardOrderId, status: status, cardId: cardId};
                dataHandler.updateCardOrder(data);
            }
            for (let i = 0; i < target.childNodes.length; i++) {
                let card = target.childNodes[i];
                let cardOrderId = i + 1;
                card.dataset.order = `${cardOrderId}`;
                let status = target.dataset.status;
                let cardId = card.dataset.cardId;
                let data = {order: cardOrderId, status: status, cardId: cardId};
                dataHandler.updateCardOrder(data);
            }
            let table = boardBody.querySelector(".board-data");
            let tableHeight = table.getBoundingClientRect().height;
            boardBody.style.height = `${tableHeight}px`;
            boardHeader.dataset.initHeight = `${tableHeight}`;
        });
    },
    createBoardFooter: function(state, username) {
        let boardFooter = document.createElement("div");
        boardFooter.classList.add('board-footer');

        if (state === "loggedIn") {
            boardFooter.innerHTML = `
            <p><i class="fas fa-unlock-alt"></i> Created by: ${username}</p>
            `;
        } else {
            boardFooter.innerHTML = `
            <p><i class="fas fa-lock"></i> Created by: ${username}</p>
            `;
        }
        return boardFooter;
    }
};