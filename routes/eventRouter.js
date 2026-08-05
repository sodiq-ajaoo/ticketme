const express = require('express');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');
const scannerController = require('../controllers/scannerController');
const upload = require('../utils/upload');

const router = express.Router();

// =========================
// Public Routes
// =========================

router
  .route('/featured')
  .get(eventController.aliasFeaturedEvents, eventController.getAllEvents);

router.route('/').get(eventController.getAllEvents);

router.route('/:id').get(eventController.getEvent);

// =========================
// Protected Routes
// =========================

router.use(authController.protect);

// Admin only
router
  .route('/event-stats')
  .get(authController.restrictTo('admin'), eventController.getEventStats);

router
  .route('/monthly-plan/:year')
  .get(authController.restrictTo('admin'), eventController.getMonthlyPlan);

// Organizer or Admin

router.patch(
  '/:id/assign-organizer',
  authController.restrictTo('admin'),
  eventController.assignOrganizer,
);

router.patch(
  '/:id/remove-organizer',
  authController.restrictTo('admin'),
  eventController.removeOrganizer,
);

router.route('/').post(
  authController.restrictTo('admin'),
  upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  eventController.createEvent,
);

// router.post(
//   '/:eventId/scanners',
//   authController.restrictTo('organizer'),
//   scannerController.createScanner,
// );

router.post('/:eventId/scanners', scannerController.createScanner);

router.get(
  '/:id/dashboard',
  authController.protect,
  authController.restrictTo('organizer', 'admin'),
  eventController.getEventDashboard,
);

router.get(
  '/:id/sales-trend',
  authController.protect,
  authController.restrictTo('admin', 'organizer'),
  eventController.getSalesTrend,
);

router.get(
  '/:id/status',
  authController.protect,
  authController.restrictTo('organizer', 'admin'),
  eventController.getAttendeeStatus,
);

router.get(
  '/:id/top-buyers',
  authController.protect,
  authController.restrictTo('organizer', 'admin'),
  eventController.getTopBuyers,
);

router.get(
  '/:id/revenue-by-ticket-type',
  authController.protect,
  authController.restrictTo('organizer', 'admin'),
  eventController.getRevenueByTicketType,
);

router
  .route('/:id')
  .patch(
    authController.restrictTo('admin'),
    upload.fields([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    eventController.updateEvent,
  )
  .delete(authController.restrictTo('admin'), eventController.deleteEvent);

module.exports = router;

// router.get(
//   '/:id/tickets',
//   authController.protect,
//   authController.restrictTo('admin'),
//   ticketController.getEventTickets
// );

// router.get(
//   '/:id/revenue',
//   authController.protect,
//   authController.restrictTo('admin'),
//   ticketController.getEventRevenue
// );

// router.post(
//   '/:id/assign-organizer',
//   authController.protect,
//   authController.restrictTo('admin'),
//   eventController.assignOrganizer
// );
