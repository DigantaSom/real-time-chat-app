const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

io.on('connection', socket => {
    console.log('We have a new connection!!!');

    socket.on('join', ({ name, room }, callback) => {
        // console.log(name, room);
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) {
            return callback(error);
        }

        /**
         * 'message' = admin generated messages' event
         * 'sendMessage' = user generated messages' event
         * emit = send event from server to client
         * on = expect event to server from client after emitting from frontend
         */

        // message only to the user, who joined the room
        socket.emit('message', {
            user: 'admin',
            text: `${user.name}, welcome to the room ${user.room}`,
        });
        // broadcast method sends a message to every user, except the user, who joined the room
        socket.broadcast
            .to(user.room)
            .emit('message', { user: 'admin', text: `${user.name} has joined!` });

        // joins the user to a room
        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback(); // for showing error in the frontend
    });

    // send user generated messages
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    // disconnect connection, and thus, remove user
    socket.on('disconnect', () => {
        console.log('User has left!');
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
        }
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
