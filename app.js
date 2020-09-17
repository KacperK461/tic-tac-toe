const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const routes = require('./routes/index');
const socketRouter = require('./routes/socket_router');
const errorsHandler = require('./middlewares/errors');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(errorsHandler.notFound);
app.use(errorsHandler.catchErrors);

io.on('connection', socket => socketRouter(socket, io));

module.exports = server;