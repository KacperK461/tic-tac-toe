const gameController = require('../controllers/gameController');

const socketRouter = (socket, io) => {
    gameController.emitRooms(io);
    socket.on('add room', mes => gameController.createRoom(socket, mes, io));
    socket.on('join room', mes => gameController.joinRoom(socket, mes, io));
    socket.on('move', mes => gameController.move(socket, mes, io));
    socket.on('disconnect', () => gameController.disconnect(socket, io));
    socket.on('leave', () => gameController.disconnect(socket, io));
};

module.exports = socketRouter;