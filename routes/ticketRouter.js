// // const express = require('express');
// // const ticketController = require('../controllers/ticketController');
// // const authController = require('../controllers/authController');

// // const router = express.Router();

// // router.use(authController.protect);

// // // Ticket purchase
// // router.post('/purchase', ticketController.purchaseTicket);

// // // My tickets
// // router.get('/my-tickets', ticketController.getMyTickets);

// // // Event tickets
// // router.get('/events/:eventId/tickets', ticketController.getEventTickets);

// // // Scan QR
// // router.post('/scan', ticketController.scanTicket);

// // // Manual check-in
// // router.patch('/:id/check-in', ticketController.checkInTicket);

// // // Cancel ticket
// // router.patch('/:id/cancel', ticketController.cancelTicket);

// // // Get single ticket (keep this LAST)
// // router.get('/:id', ticketController.getTicket);

// // module.exports = router;

// const express = require('express');
// const ticketController = require('../controllers/ticketController');
// const authController = require('../controllers/authController');

// const router = express.Router();

// router.use(authController.protect);

// // Reserve multiple ticket types
// router.post('/reserve', ticketController.reserveTickets);

// // Existing single-ticket purchase
// // router.post('/purchase', ticketController.purchaseTicket);

// // My tickets
// router.get('/my-tickets', ticketController.getMyTickets);

// // Event tickets
// router.get('/events/:eventId/tickets', ticketController.getEventTickets);

// router.get(
//   '/:ticketId/download',
//   authController.protect,
//   ticketController.downloadTicket,
// );

// router.get('/my-tickets', ticketController.getMyTickets);

// // router.get('/my-tickets/:id', protect, getMyTicket);
// router.get('/my-tickets/:id', ticketController.getMyTicket);

// // Scan QR
// // router.post('/scan', ticketController.scanTicket);

// // Manual check-in
// // router.patch('/:id/check-in', ticketController.checkInTicket);

// // Cancel ticket
// router.patch('/:id/cancel', ticketController.cancelTicket);

// // Get single ticket
// router.get('/:id', ticketController.getTicket);

// module.exports = router;

const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect everything below
router.use(authController.protect);

// Reserve tickets
router.post('/reserve', ticketController.reserveTickets);

// My tickets
router.get('/my-tickets', ticketController.getMyTickets);

// Single ticket (with QR)
router.get('/my-tickets/:id', ticketController.getMyTicket);

// Download PDF
router.get('/:ticketId/download', ticketController.downloadTicket);

// Event attendees
router.get('/events/:eventId/tickets', ticketController.getEventTickets);

// Cancel ticket
router.patch('/:id/cancel', ticketController.cancelTicket);

// Single ticket
router.get('/:id', ticketController.getTicket);

module.exports = router;
