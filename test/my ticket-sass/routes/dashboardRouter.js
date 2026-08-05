const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/admin',
  authController.restrictTo('admin'),
  dashboardController.getAdminDashboard,
);

router.get(
  '/organizer',
  authController.restrictTo('organizer'),
  dashboardController.getOrganizerDashboard,
);

module.exports = router;
