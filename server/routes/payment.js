const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');
const { isLoggedIn } = require('../middleware'); 

router.post('/create-session', paymentController.createPaymentSession);

module.exports = router;