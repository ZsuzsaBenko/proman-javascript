import {templates} from "./templates.js";
import {dataHandler} from "./data_handler.js";

export let dom = {
    showBoards: function(boards) {
        for (let board of boards) {
            templates.createBoardElement(board.title, board.statuses, board.id, board.username, board["user_id"]);
            dom.showCards(board);
        }
    },
    showCards: function(board) {
        let cards = board.cards;
        let state = localStorage.getItem("state");
        for (let i = 0; i < cards.length; i++) {
            let column = dom.addCard(board, cards[i]);
            let cardElement = templates.createCardElement(cards[i].title, cards[i].id, cards[i].order_num, state);
            column.appendChild(cardElement);
        }
    },
    addCard: function(board, card) {
        let column;
        if (card.status_id === 1) {
            column = document.querySelector(`.board[data-board-id='${board.id}'] .cards > :first-child`);
        }
        if (card.status_id === 2) {
            column = document.querySelector(`.board[data-board-id='${board.id}'] .cards > :nth-child(2)`);
        }
        if (card.status_id === 3) {
            column = document.querySelector(`.board[data-board-id='${board.id}'] .cards > :nth-child(3)`);
        }
        if (card.status_id === 4) {
            column = document.querySelector(`.board[data-board-id='${board.id}'] .cards > :last-child`);
        }
        return column
    },
    toggleBoard: function(event) {
        if (event.target.className !== 'new-card-button' && event.target.className !== 'board-title' &&
            event.target.className !== 'delete-board-button') {
            let boardHeader;
            if (event.target.className === 'fas fa-caret-up') {
                boardHeader = event.target.parentElement;
            } else {
                boardHeader = event.target;
            }
            const tableContainer = boardHeader.nextSibling;
            const table = tableContainer.querySelector('.board-data');
            const arrow = boardHeader.querySelector('.fas');
            const newCardButton = boardHeader.querySelector('.new-card-button');
            const deleteBoardButton = boardHeader.querySelector(".delete-board-button");

            const isTableOpen = boardHeader.dataset.tableIsOpen;
            const initHeight = boardHeader.dataset.initHeight;

            tableContainer.style.height = `${table.getBoundingClientRect().height}px`;
            boardHeader.dataset.initHeight = `${table.getBoundingClientRect().height}`;

            if (isTableOpen === 'true') {
                boardHeader.dataset.tableIsOpen = 'false';
                tableContainer.style.height = '0px';
                arrow.style.transform = 'translate(0, 25%) rotateX(180deg)';
                table.style.display = 'none';
                newCardButton.style.visibility = 'hidden';
                deleteBoardButton.style.visibility = 'hidden';
            } else {
                boardHeader.dataset.tableIsOpen = 'true';
                tableContainer.style.height = `${initHeight}px`;
                arrow.style.transform = 'rotateX(0deg)';

                setTimeout(function() {
                    table.style.display = 'table';
                    newCardButton.style.visibility = 'visible';
                    deleteBoardButton.style.visibility = 'visible';
                }, 600);
            }
        }
    },
    setModalTitle: function() {
        const regButton = document.querySelector('#registration');
        const logButton = document.querySelector('#login');
        const modalTitle = document.querySelector('#modal-title');
        const username = document.querySelector('#username');
        const password = document.querySelector('#password');
        const submitButton = document.querySelector('#submitButton');
        regButton.addEventListener('click', function(event) {
            dom.giveAutofocus();
            modalTitle.innerHTML = "Registration";
            submitButton.dataset.status = 'registration';
            username.value = "";
            password.value = "";
        });
        logButton.addEventListener('click', function(event) {
            dom.giveAutofocus();
            modalTitle.innerHTML = "Login";
            submitButton.dataset.status = 'login';
            username.value = "";
            password.value = "";
        });
    },
    giveAutofocus: function() {
        $('#modal').on('shown.bs.modal', function () {
                $('#username').focus();
            });
    },
    registerOrLoginUser: function() {
        const username = document.querySelector('#username');
        const password = document.querySelector('#password');
        const submitButton = document.querySelector('#submitButton');
        submitButton.addEventListener('click', function (event) {
            let data = {
                username: username.value,
                password: password.value
            };
            if (submitButton.dataset.status === 'registration') {
                dataHandler.handleRegistration(data);
            } else {
                dataHandler.handleLogin(data)
            }
        });
    },
    logoutUser: function() {
        const logoutButton = document.querySelector("#logout");
        logoutButton.addEventListener("click", function(event) {
            dataHandler.handleLogout();
        })
    }
};


