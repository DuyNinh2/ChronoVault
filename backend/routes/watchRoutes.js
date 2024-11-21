const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController');

// Define routes
router.get('/api/watches', watchController.getAllWatches);
router.get('/:id', watchController.getWatchById);

const upload = require('../utils/upload');
router.post('/api/addproduct', upload.array('images', 3), watchController.addProduct);

router.delete('/api/deleteproduct/:id', watchController.deleteProduct);




module.exports = router;
