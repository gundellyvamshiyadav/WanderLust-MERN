const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const wrapAsync = require('../utils/wrapAsync');
const { optionalAuth } = require('../middleware.js');

router.post('/', optionalAuth, wrapAsync(chatController.generateResponse));

module.exports = router;