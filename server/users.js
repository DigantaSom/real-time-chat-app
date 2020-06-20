const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // below block is so that, a new user cannot go into the same name and same room.
    const exisitingUser = users.find(user => user.name === name && user.room === room);
    if (exisitingUser) {
        return { error: 'Username is taken' };
    }
    // else, create a new user
    const user = { id, name, room };
    users.push(user);
    return { user };
};

const removeUser = id => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users.splice(index, 1)[0];
    }
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
