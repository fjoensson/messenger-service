let messageIdCounter = 1;

function getMessageById(messageId) {
    return messageList.find(message => message.id === messageId);
}

function saveMessage(message) {

    const messageWithId = {
        ...message,
        id: messageIdCounter
    }
    messageIdCounter++;
    messageList.push(messageWithId);
    return messageWithId;
}

//mock
const messageList = [];

module.exports = {
    saveMessage,
    getMessageById,
}