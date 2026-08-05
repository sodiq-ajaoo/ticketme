const express = require('express');

const checkInController = require('../controllers/checkInController');
const scannerAuthController = require('../controllers/scannerAuthController');

const router = express.Router();

router.post(
  '/',
  scannerAuthController.protect,
  checkInController.checkInTicket,
);

module.exports = router;
