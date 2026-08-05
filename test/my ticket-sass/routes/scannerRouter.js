// const express = require('express');

// const scannerController = require('../controllers/scannerController');
// const authController = require('../controllers/authController');

// const router = express.Router();

// router.use(authController.protect);

// router.post('/', scannerController.createScanner);

// router.get('/event/:eventId', scannerController.getEventScanners);

// router.patch('/:id', scannerController.updateScanner);

// router.delete('/:id', scannerController.deleteScanner);

// module.exports = router;

const express = require('express');

const scannerController = require('../controllers/scannerController');
const authController = require('../controllers/authController');
const scannerAuthController = require('../controllers/scannerAuthController');

const router = express.Router();

router.use(authController.protect);

router.get('/event/:eventId', scannerController.getEventScanners);

router.patch('/:id', scannerController.updateScanner);

router.delete('/:id', scannerController.deleteScanner);

router.post(
  '/check-in',
  scannerAuthController.protect,
  scannerController.checkInTicket,
);

module.exports = router;
