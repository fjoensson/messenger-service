
function getUser(userId) {
    return userList.find(user => user.id === userId);
}

function updateUserLastReadIndex(userId, lastReadIndex) {
    const updatedUserList = userList
        .map(user => {
            if (user.id === userId) {
                return {
                    ...user, 
                    lastReadIndex: lastReadIndex
                };
            }
            return user;
        });
    userList = updatedUserList;
    return true;
}

//mock
let userList = [
    { id:111, lastReadIndex: 0 },
    { id:222, lastReadIndex: 0 },
    { id:333, lastReadIndex: 0 }
];

module.exports = {
    getUser,
    updateUserLastReadIndex
}