const express = require('express');
const router = express.Router();
const momoController = require('../controllers/momoController');

router.post('/api/momo/pay', momoController.processPayment);

module.exports = router;
