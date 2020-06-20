import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Messages.css';
// components
import Message from './Message/Message';

const Messages = ({ messages, name }) => (
    <ScrollToBottom className='messages'>
        {messages.map((message, i) => (
            <Message key={i} message={message} name={name} />
        ))}
    </ScrollToBottom>
);
export default Messages;
