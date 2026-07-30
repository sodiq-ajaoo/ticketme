const express = require('express');

const analyticsController = require('../controllers/analyticsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/:eventId', analyticsController.getEventAnalytics);

module.exports = router;
