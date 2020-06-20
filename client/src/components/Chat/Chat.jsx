import React, { useState, useEffect } from 'react';
import './Chat.css';

import queryString from 'query-string';
import io from 'socket.io-client';
// components
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        // see on()'s of server/index.js after this, because, this below code will on every useEffect() run after callback() in server/index.js
        socket.emit('join', { name, room }, error => {
            if (error) {
                alert(error);
            }
        });

        // unmount component / disconnect socket.io connection
        return () => {
            socket.emit('disconnect');
            socket.off();
        };
    }, [ENDPOINT, location.search]);

    // useEffect(() => {
    //     socket.on('message', message => {
    //         setMessages([...messages, message]);
    //     });
    // }, [messages, message]);
    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message]);
        });
        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });
    }, [messages, message]);

    // function for sending messages
    const sendMessage = e => {
        e.preventDefault();

        if (message) {
            // refer to socket.on('sendMessage', ...) on server/index.js
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    // console.log(message);
    // console.log(messages);
    console.log(users);

    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    );
};

export default Chat;
