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


router.delete('/api/deleteproduct/:id', watchController.deleteProduct);
// router.get('/archived-watches', watchController.getArchivedWatches);
// router.put('/archive-product/:id', watchController.archiveProduct);
// router.put('/restore-product/:id', watchController.restoreProduct);



module.exports = router;
