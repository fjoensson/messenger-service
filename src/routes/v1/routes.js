const express = require('express');
const router = express.Router();
const userRepo = require('../../db/userRepo');
const messageRepo = require('../../db/messageRepo'); 

router.get('/', function (req, res, next) {
    res.send('This is the messaging-service!')
});

// params: userId
// fetch new messages is default, param=userId
// ordered+start/stop index, param=userId, startIndex, StopIndex
router.get('/messages', [
    initMessage,
    validateGetMessage,
    retrieveMessage,
    updateUserLastReadIndex,
    sendGetResponse
]);

router.post('/messages', [
    initMessage,
    validateMessage,
    storeMessage,
    sendPostResponse
]);

router.delete('/messages/:messageId', [
    initMessage,
    // validateMessage - allowed for client?
    deleteMessage,
    sendDeleteResponse
]);

//There is no standard for this but I find this format very consistent with post
router.delete('/messages', [
    initMessage,
    validateDeleteMultiMessage, // and allowed for client?
    deleteMultiMessage,
    sendDeleteMultiResponse
]);


function initMessage(req, res, next) {
    
    res.locals = {
        messageId: parseInt(req.params.messageId),
        messageText: req.body.messageText,
        recipientId: parseInt(req.body.recipientId),
        user: undefined,
        dbResult: undefined,
        messageIds : req.body.messageIds,
        qUserId: parseInt(req.query.userId),
        qStartIndex: req.query.startIndex,
        qEndIndex: req.query.endIndex,
    }
    next();
}

function validateMessage(req, res, next) {

    // example of static validation 
    // use api-validator and check. e.g type, length, format, escaping 
    if (res.locals.messageText.length > 144) {
        return res.status(400).send({ error: 'messageText longer than 144 char'})
    }

    // example of dymanic validation
    // send only to registred users
    const user = userRepo.getUser(res.locals.recipientId);
    if (user) {
        //cache this for future use
        res.locals.user = user;
        next();
    } else {
        return res.status(401).send({ error: 'not authorized'})
    }
}

function validateGetMessage(req, res, next) {

    //TODO api-validator to validate all params...
    if (!res.locals.qUserId) {
        return res.status(400).send({ error: 'userId must be provided'})
    }

    const user = userRepo.getUser(res.locals.qUserId);
    if (user) {
        res.locals.user = user;
    } else {
        return res.status(404).send({ error: 'user not found'})
    }

    if (res.locals.qStartIndex && !res.locals.qEndIndex) {
        return res.status(400).send({ error: 'endIndex must be provided'})
    }
    if (res.locals.qEndIndex && !res.locals.qStartIndex) {
        return res.status(400).send({ error: 'startIndex must be provided'})
    }
    next();
}

function updateUserLastReadIndex(req, res, next) {
    if (res.locals.qStartIndex || res.locals.qEndIndex) {
        return next();
    }

    const ids = res.locals.dbResult
    .filter( e => e)  //remove null
    .filter( e => e !== NaN)  //remove NaN
    .map( e => e.id )
    
    if (ids.length > 0) {
        const lastReadIndex = Math.max(...ids);
        userRepo.updateUserLastReadIndex(res.locals.qUserId, lastReadIndex)
    }
    next();
}

function validateDeleteMultiMessage(req, res, next) {

    if (!Array.isArray(res.locals.messageIds)) {
        return res.status(400).send({ error: 'messageIds must be an array'})
    }
    //also check if each element is an integer
    next()
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

function storeMessage(req, res, next) {

    const message = {
        userId: res.locals.recipientId,
        text: res.locals.messageText
    }

    //in the real world this could be an asynch (db) call
    const dbResult = messageRepo.saveMessage(message)
    //handle potential errors
    res.locals.dbResult = dbResult;
    next();
}

function retrieveMessage(req, res, next) {
    let dbResult;

    if (res.locals.qStartIndex || res.locals.qEndIndex) {
        //in the real world this could be an asynch (db) call
        dbResult = messageRepo.getMessageByUserIdAndTimestamp(res.locals.qUserId, res.locals.qStartIndex, res.locals.qEndIndex);
        //handle potential errors
    } else {
        dbResult = messageRepo.getMessageByUserIdAndLastReadIndex(res.locals.qUserId, res.locals.user.lastReadIndex);
    }
    res.locals.dbResult = dbResult;
    next();

}

function sendPostResponse(req, res, next) {
    console.log('Created message #', res.locals.dbResult.id);
    console.log(res.locals);
    res.status(201).send({...res.locals});
}

function sendDeleteResponse(req, res, next) {
    console.log('Deleted message #', res.locals.dbResult.id);
    console.log(res.locals);
    res.status(200).send({...res.locals});
}

function sendDeleteMultiResponse(req, res, next) {
    const deleteMessageIds = res.locals.dbResult
        .filter( e => e)  //remove null
        .map( e => e.id );

    console.log('Deleted messages #', deleteMessageIds);
    console.log(res.locals);
    res.status(200).send({...res.locals});
}

function sendGetResponse(req, res, next) {
    const getMessageIds = res.locals.dbResult
        .filter( e => e)  //remove null
        .map( e => e.id );

    console.log('Get messages #', getMessageIds);
    console.log(res.locals);
    res.status(200).send(res.locals.dbResult);
}



module.exports = router;