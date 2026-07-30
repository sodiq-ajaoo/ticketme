const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/initialize', paymentController.initializePayment);

router.get('/verify/:reference', paymentController.verifyPayment);

module.exports = router;
