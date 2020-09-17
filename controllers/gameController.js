const setGame = require('../game/game');

let rooms = [];

exports.emitRooms = (io) => {
    let msg = [];
    rooms.forEach(room => {
        if(room && !room.guest) {
            msg.push({
                roomName: room.roomName, 
                roomId: room.roomId
            });
        }
    });
    io.emit('rooms', msg);
};

exports.createRoom = (socket, roomName , io) => {
    const roomId = `room-${socket.id}`;
    rooms.push({
        roomName: roomName === String ? roomName : null, 
        roomId,
        creator: socket.id,
        guest: null,
    });
    socket.join(roomId);
    this.emitRooms(io);
}; 

exports.joinRoom = (socket, roomId, io) => {
    for(let room of rooms) {
        if(!room.guest && room.roomId === roomId) {
            room.guest = socket.id;
            socket.join(room.roomId);
            room.game = new setGame();
            io.to(room.roomId).emit('start game', {
                turn: room.game.turn, 
                board: room.game.board 
            });
            this.emitRooms(io);
        }
    } 
};

exports.move = (socket, index, io) => {
    for(room of rooms) {
        if((socket.id === room.creator || socket.id === room.guest) && (index > 0 && index < 9)) {
            if(room.game.turn === 'O' && socket.id === room.guest) {
                room.game.addField(index);       
            } else if(room.game.turn === 'X' && socket.id === room.creator) {
                room.game.addField(index);              
            } 
            io.to(room.roomId).emit('data', {
                board: room.game.board,
                turn: room.game.turn,
                winner: room.game.winner
            });    
        }
    }
}

exports.disconnect = (socket, io) => {
    rooms.forEach((room, index) =>  {
        if(socket.id === room.guest) {
            room.guest = null;
            io.to(room.roomId).emit('opponent left');
            this.emitRooms(io);
        }
        else if(socket.id === room.creator) {
            io.to(room.roomId).emit('creator left');
            if(io.sockets.sockets[room.guest])
                io.sockets.sockets[room.guest].leave(room.roomId);
            delete room.game;
            rooms.splice(index, 1);
            this.emitRooms(io);
        }
    });
}