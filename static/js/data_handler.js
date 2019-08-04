import {dom} from "./dom.js";

export let dataHandler = {
    reloadContent: function() {
        let fullContent = document.querySelector("#full-content");
        fullContent.innerHTML = "";
        dataHandler.getBoards();
    },
    getBoards: function() {
        fetch('/boards')
            .then((response) => response.json())
            .then((response) => dom.showBoards(response))
    },
    saveNewPublicBoard: function() {
        let url = '/boards';
        let data = {
            title: "New Public Board",
            statuses: "New, In Progress, Testing, Done",
            type: false
        };
        this.ajaxWrapperWithReload(url, data, 'POST');
    },
    saveNewPrivateBoard: function() {
        let url = '/boards';
        let data = {
            title: "New Private Board",
            statuses: "New, In Progress, Testing, Done",
            type: true
        };
        this.ajaxWrapperWithReload(url, data, 'POST');
    },
    saveNewCard: function(boardId, orderNumber) {
        let url = '/cards';
        let data = {title: "New Card", board_id: boardId, status_id: 1, order_num: orderNumber};
        this.ajaxWrapperWithReload(url, data, 'POST');
    },
    deleteCard: function(clickedCardId) {
        let url = '/cards';
        let data = {card_id: clickedCardId};
        this.ajaxWrapperWithReload(url, data, 'DELETE');
    },
    deleteBoard: function(board_id) {
        let url = '/boards';
        let data = {board_id: board_id};
        this.ajaxWrapperWithReload(url, data, 'DELETE');
    },
    updateBoard: function(board_id, new_title) {
        let url = '/boards';
        let data = {id: board_id, new_title: new_title};
        this.ajaxWrapperWithoutReload(url, data, 'PUT');
    },
    updateCard: function(card_id, new_title) {
        let url = '/cards';
        let data = {id: card_id, new_title: new_title};
        this.ajaxWrapperWithoutReload(url, data, 'PUT');
    },
    updateStatuses: function(statuses, id) {
        let url = '/statuses';
        let data = {statuses: statuses, id: id};
        this.ajaxWrapperWithoutReload(url, data, 'PUT');
    },
    updateCardOrder: function(data) {
        let url = '/card-order-update';
        this.ajaxWrapperWithoutReload(url, data, 'PUT');
    },
    handleRegistration: function(data) {
        let url = '/registration';
        this.ajaxRegistration(url, data, 'POST')
    },
    handleLogin: function(data) {
        let url = '/login';
        this.ajaxLogin(url, data, 'POST')
    },
    handleLogout: function() {
        let url = '/logout';
        this.ajaxLogout(url);
    },
    emptyInputFields: function() {
        const username = document.querySelector('#username');
        const password = document.querySelector('#password');
        username.value = "";
        password.value = "";
    },
    ajaxWrapperWithReload: function(url, data, method) {
        fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Success:', JSON.stringify(response));
                dataHandler.reloadContent();
            });
    },
    ajaxWrapperWithoutReload: function(url, data, method) {
        fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Success:', JSON.stringify(response));
            });
    },
    ajaxRegistration: function(url, data, method) {
        fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((obj) => {
                console.log(obj.error);
                if (obj.error === "error") {
                    alert("Sorry, this username is already taken.");
                    this.emptyInputFields();
                } else {
                    window.location.href = ('/');
                }
            });
    },
    ajaxLogin: function(url, data, method) {
        fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((obj) => {
                console.log(obj.state, obj.error);
                if (obj.state) {
                    localStorage.setItem("state", "loggedIn");
                    window.location.href = ('/');
                } else {
                    alert("Sorry, incorrect username or password!");
                    this.emptyInputFields();
                }
            });
    },
    ajaxLogout: function(url) {
        fetch(url)
            .then((response) => {
                console.log(response);
                localStorage.setItem("state", "");
                window.location.href = ('/');
            })
    }
};
