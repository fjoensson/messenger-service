let messageIdCounter = 1;
let messageList = []; //mock store/db


function getMessageById(messageId) {
    return messageList.find(message => message.id === messageId);
}

function getMessageByUserId(userId, lastReadIndex) {
    return messageList
        .filter(message => message.userId === userId)
        .filter(message => message.id > lastReadIndex)
}

function deleteMessageById(messageId) {
    const message = messageList.find(message => message.id === messageId);
    if (!message) {
        return null;
    }
    const updatedMessageList = messageList.filter(message => message.id != messageId);
    messageList = updatedMessageList
    return message;
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


module.exports = {
    saveMessage,
    getMessageById,
    getMessageByUserId,
    deleteMessageById,
}