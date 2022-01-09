
function getUser(userId) {
    return userList.includes(userId);
}

//mock
const userList = [111,222,333];

module.exports = {
    getUser
}