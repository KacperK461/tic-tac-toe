"use strict";

let socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const roomsContainer = document.querySelector('#rooms');
    const addRoom = document.querySelector('#add-room');
    const game = document.querySelector('#game');
    const start = document.querySelector('#start');
    const info = document.querySelector('#info');
    const boxes = document.querySelectorAll('div[id^=box]');
    const returnBtn = document.querySelector('#return-btn');

    let symbol;
    let turn;
    let board;
    let winner;

    socket.on('rooms', (rooms) => {
        roomsContainer.innerHTML = '';
        for(let room of rooms) {
            const div = document.createElement('div');
            div.classList.add('room');
            div.innerHTML = 
            `<p class="room-name">${room.roomName ? room.roomName : '[noname]'}</p>
            <button class="btn room-btn" type="button" id="${room.roomId}">Join</button>`;
            roomsContainer.appendChild(div);
            document.querySelector(`#${room.roomId}`).addEventListener('click', () => {
                socket.emit('join room', room.roomId);
                roomsContainer.removeChild(div);
                game.removeAttribute('style');
                start.style.display = 'none';
                symbol = 'O';
            });
        }
    });

    socket.on('start game', (msg) => {
        turn = msg.turn;
        board = msg.board;
        renderBoard();
        if(symbol === turn) {
            info.innerText = 'You start';
        }
        else {
            info.innerText = 'Opponent starts';
        }
        for(let box of boxes) {
            box.addEventListener('click', clickFunc);        
        }
    });

    socket.on('data', (msg) => {
        turn = msg.turn;
        board = msg.board;
        winner = msg.winner; 
        renderBoard()
    });


    socket.on('opponent left', () => {
        reset();
        info.innerText = 'Opponent has left, waiting for another...';
    });

    socket.on('creator left', () => {
        reset();
        info.innerText = 'Opponent has left';
    })

    addRoom.addEventListener('submit', (event) => {
        event.preventDefault();
        socket.emit('add room', event.target[0].value);
        event.target[0].value = '';
        game.removeAttribute('style');
        start.style.display = 'none';
        info.innerText = 'Waiting for opponent...';
        symbol = 'X';
    });

    returnBtn.addEventListener('click', () => {
        symbol = null;
        game.style.display = 'none';
        start.removeAttribute('style');
        socket.emit('leave');
    })

    const reset = () => {
        turn = null;
        board = null;
        winner = null;
        for(let box of boxes){
            box.classList.value = "box";
            box.removeEventListener('click', clickFunc);
        }
    }

    const clickFunc = ({target}) => {
        if(target.classList[1] === "box-cross-hov" || target.classList[1] === "box-circle-hov") {
            socket.emit('move', target.id.charAt(3));
        }      
    }

    const renderBoard = () => {
        boxes.forEach((box, index) => {
            box.classList.remove(symbol === 'O' ? 'box-circle-hov' : 'box-cross-hov');

            if(board[index] === 'X') {
                box.classList.add('box-cross')
            }
            else if(board[index] === 'O') {
                box.classList.add('box-circle');
            }
            else if(turn === symbol && !winner) {
                box.classList.add(symbol === 'O' ? 'box-circle-hov' : 'box-cross-hov');
            }
        });

        if(symbol === turn) {
            info.innerText = 'Your turn';
        }
        else {
            info.innerText = `Opponent's turn`;
        }

        if(winner) {
            if(winner === 'draw') {
                info.innerText = 'Draw';
            }
            else if(winner === symbol) {
                info.innerText = 'Win';
            }
            else {
                info.innerText = 'Lose';
            }
        }
    }
});


