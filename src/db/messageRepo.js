let messageIdCounter = 1;
let messageList = []; //mock store/db


function getMessageById(messageId) {
    return messageList.find(message => message.id === messageId);
}

function getMessageByUserIdAndLastReadIndex(userId, lastReadIndex) {
    return messageList
        .filter(message => message.userId === userId)
        .filter(message => message.id > lastReadIndex)
}

function getMessageByUserIdAndTimestamp(userId, startIndex, endIndex) {
    return messageList
        .filter(message => message.userId === userId)
        .filter(message => message.timestamp > startIndex)
        .filter(message => message.timestamp < endIndex);
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
        id: messageIdCounter,
        timestamp: Date.now()
    }
    messageIdCounter++;
    messageList.push(messageWithId);
    return messageWithId;
}


module.exports = {
    saveMessage,
    getMessageById,
    getMessageByUserIdAndLastReadIndex,
    getMessageByUserIdAndTimestamp,
    deleteMessageById
}