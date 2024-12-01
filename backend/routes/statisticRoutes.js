const express = require('express');
const router = express.Router();
const statisticController = require('../controllers/statisticController');

router.get('/completedOrders', statisticController.getCompletedOrders);

module.exports = router;