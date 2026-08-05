const express = require('express');

const scannerAuthController = require('../controllers/scannerAuthController');

const router = express.Router();

router.post('/login', scannerAuthController.login);

module.exports = router;
