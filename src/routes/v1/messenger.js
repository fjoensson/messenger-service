const express = require('express');
const router = express.Router();
const messenger = require('../../middleware/v1/messenger'); 

router.get('/', function (req, res, next) {
    res.send('This is the messenger-service!')
});

router.get('/messages', [
    messenger.initMessage,
    messenger.validateGetMessage,
    messenger.retrieveMessage,
    messenger.updateUserLastReadIndex,
    messenger.sendGetResponse
]);

router.post('/messages', [
    messenger.initMessage,
    messenger.validateMessage,
    messenger.storeMessage,
    messenger.sendPostResponse
]);

router.delete('/messages/:messageId', [
    messenger.initMessage,
    messenger.deleteMessage,
    messenger.sendDeleteResponse
]);

router.delete('/messages', [
    messenger.initMessage,
    messenger.deleteMultiMessage,
    messenger.sendDeleteMultiMessageResponse
]);

module.exports = router;