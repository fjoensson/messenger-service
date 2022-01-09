const express = require('express');
const router = express.Router();
const userRepo = require('../../db/userRepo');
const messageRepo = require('../../db/messageRepo'); 

router.get('/', function (req, res, next) {
    res.send('This is the messaging-service!')
});

router.post('/messages', [
    initMessage,
    validateMessage,
    storeMessage,
    sendResponse
]);

function initMessage(req, res, next) {

    res.locals = {
        messageId: undefined,
        messageText: req.body.messageText,
        recipientId: parseInt(req.body.recipientId),
        user: undefined,
        dbInsertResult: undefined
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
    // only registred users
    const user = userRepo.getUser(res.locals.recipientId);
    if (user) {
        //cache this for future use
        res.locals.user = user;
        next();
    } else {
        return res.status(401).send({ error: 'not authorized'})
    }
}

function storeMessage(req, res, next) {

    const message = {
        userId: res.locals.recipientId,
        text: res.locals.messageText
    }

    //in the real wolrd this could be an asynch (db) call
    const dbResult = messageRepo.saveMessage(message)
    //handle potential errors
    res.locals.dbInsertResult = dbResult;
    next();
}

function sendResponse(req, res, next) {
    console.log(res.locals);
    res.send({...res.locals});
}


module.exports = router;