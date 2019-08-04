import {dataHandler} from "./data_handler.js";
import {dom} from "./dom.js";

function init() {
    dataHandler.getBoards();

    const state = localStorage.getItem("state");
    if (state === "loggedIn") {
        const addNewPublicBoard = document.querySelector('#new-board-button');
        addNewPublicBoard.addEventListener('click', function() {
            dataHandler.saveNewPublicBoard();
        });

        const addNewPrivateBoard = document.querySelector('#new-private-board-button');
        addNewPrivateBoard.addEventListener('click', function() {
            dataHandler.saveNewPrivateBoard();
        });

        dom.logoutUser();
    } else {
        dom.setModalTitle();
        dom.registerOrLoginUser();
    }
}

window.addEventListener("load", function(event) {
   init();
});
