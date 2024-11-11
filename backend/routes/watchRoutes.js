const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController'); 

// Define routes
router.get('/watches', watchController.getAllWatches);
router.get('/:id', watchController.getWatchById);


module.exports = router;
