const express = require('express');

const attendeeController = require('../controllers/attendeeController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/:eventId', attendeeController.getAttendees);

module.exports = router;
