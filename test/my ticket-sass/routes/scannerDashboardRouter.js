const express = require('express');

const scannerDashboardController = require('../controllers/scannerDashboardController');
const scannerAuthController = require('../controllers/scannerAuthController');

const router = express.Router();

router.get(
  '/',
  scannerAuthController.protect,
  scannerDashboardController.getDashboard,
);

module.exports = router;
