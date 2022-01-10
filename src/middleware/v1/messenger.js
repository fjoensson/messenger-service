const userRepo = require('../../db/userRepo');
const messageRepo = require('../../db/messageRepo'); 

function initMessage(req, res, next) {
    
    res.locals = {
        messageId: parseInt(req.params.messageId),
        messageIds: req.body.messageIds,
        message: {
            messageText: req.body.messageText,
            recipientId: parseInt(req.body.recipientId),
        },
        query:{
            userId: parseInt(req.query.userId),
            startIndex: req.query.startIndex,
            endIndex: req.query.endIndex,
        },
        user: undefined,
        dbResult: undefined,
    }
    next();
}

function validateMessage(req, res, next) {

    // example of static validation 
    // use api-validator and check. e.g type, length, format, escaping 
    if (res.locals.message.messageText.length > 144) {
        return res.status(400).send({ error: 'messageText longer than 144 char'})
    }

    // example of dymanic validation
    // send only to registred users
    const user = userRepo.getUser(res.locals.message.recipientId);
    if (user) {
        res.locals.user = user;
        next();
    } else {
        return res.status(404).send({ error: 'recipientId not found'})
    }
}

function storeMessage(req, res, next) {

    const message = {
        userId: res.locals.message.recipientId,
        text: res.locals.message.messageText
    }

    //in the real world this could be an asynch (db) call
    const dbResult = messageRepo.saveMessage(message)
    //handle potential errors
    res.locals.dbResult = dbResult;
    next();
}

function sendPostResponse(req, res, next) {
    console.log('Created message #', res.locals.dbResult.id);
    res.status(201).send(res.locals.dbResult);
}

function validateGetMessage(req, res, next) {
    //TODO api-validator

    if (!res.locals.query.userId) {
        return res.status(400).send({ error: 'userId must be provided'})
    }

    const user = userRepo.getUser(res.locals.query.userId);
    if (user) {
        res.locals.user = user;
    } else {
        return res.status(404).send({ error: 'user not found'})
    }

    if (res.locals.query.startIndex && !res.locals.query.endIndex) {
        return res.status(400).send({ error: 'endIndex must be provided'})
    }
    if (res.locals.query.endIndex && !res.locals.query.startIndex) {
        return res.status(400).send({ error: 'startIndex must be provided'})
    }
    next();
}

function retrieveMessage(req, res, next) {
    let dbResult;

    if (res.locals.query.startIndex || res.locals.query.endIndex) {
        //in the real world this could be an asynch (db) call
        dbResult = messageRepo.getMessageByUserIdAndTimestamp(res.locals.query.userId, res.locals.query.startIndex, res.locals.query.endIndex);
        //handle potential errors
    } else {
        dbResult = messageRepo.getMessageByUserIdAndLastReadIndex(res.locals.query.userId, res.locals.user.lastReadIndex);
    }
    res.locals.dbResult = dbResult;
    next();
}

function updateUserLastReadIndex(req, res, next) {
    if (res.locals.query.startIndex || res.locals.query.endIndex) {
        return next();
    }

    const ids = res.locals.dbResult
        .filter( e => e)  //remove null
        .filter( e => e !== NaN)  //remove NaN
        .map( e => e.id )
    
    if (ids.length > 0) {
        const lastReadIndex = Math.max(...ids);
        userRepo.updateUserLastReadIndex(res.locals.query.userId, lastReadIndex)
    }
    next();
}

function sendGetResponse(req, res, next) {
    const getMessageIds = res.locals.dbResult
        .filter( e => e)  //remove null
        .map( e => e.id );

    console.log('Get messages #', getMessageIds);
    res.status(200).send(res.locals.dbResult);
}

function deleteMessage(req, res, next) {

    //in the real world this could be an asynch (db) call
    const dbResult = messageRepo.deleteMessageById(res.locals.messageId)
    //handle potential errors

    if (dbResult) {
        res.locals.dbResult = dbResult;
        next();
    } else {
        return res.status(404).send({ error: 'message not found'})
    } 
}

function sendDeleteResponse(req, res, next) {
    console.log('Deleted message #', res.locals.dbResult.id);
    res.status(200).send(res.locals.dbResult);
}

function deleteMultiMessage(req, res, next) {
    const ids = res.locals.messageIds;
    const dbResultList = []

    //in the real world this could be an multiple asynch (db) call
    //that would be collected using a Promise.All(...)
    ids.forEach(id => {
        const dbResult = messageRepo.deleteMessageById(id)
        dbResultList.push(dbResult)
    }); 
    //handle potential errors

    //TODO improve handling of partial failures
    if (dbResultList.length > 0) {
        res.locals.dbResult = dbResultList;
        next();
    } else {
        return res.status(404).send({ error: 'message not found'})
    } 
}

function sendDeleteMultiMessageResponse(req, res, next) {
    const deleteMessageIds = res.locals.dbResult
        .filter( e => e)  //remove null
        .map( e => e.id );

    console.log('Deleted messages #', deleteMessageIds);
    res.status(200).send(res.locals.dbResult);
}

module.exports = {
    initMessage,
    validateMessage,
    storeMessage,
    sendPostResponse,
    validateGetMessage,
    retrieveMessage,
    updateUserLastReadIndex,
    sendGetResponse,
    deleteMessage,
    sendDeleteResponse,
    deleteMultiMessage,
    sendDeleteMultiMessageResponse,
}