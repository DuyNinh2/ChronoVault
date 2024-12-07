const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController');

// Define routes
router.get('/api/watches', watchController.getAllWatches);
router.get('/:id', watchController.getWatchById);

const upload = require('../utils/upload');
router.post('/api/addproduct', upload.array('images', 3), watchController.addProduct);
// Update a watch by ID
router.put('/api/updatewatch/:id', upload.array('images', 3), watchController.updateWatch);

// Định nghĩa route cho phục hồi sản phẩm
router.put('/api/restoreproduct/:id', watchController.restoreProduct);
router.put('/api/hideproduct/:id', watchController.hideProduct);

module.exports = router;
