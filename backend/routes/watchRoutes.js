const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController');

// Define routes
router.get('/api/watches', watchController.getAllWatches);
router.get('/:id', watchController.getWatchById);

const upload = require('../utils/upload'); // Đảm bảo bạn đã cấu hình multer đúng

// Route thêm sản phẩm với multer để upload ảnh
router.post('/api/addproduct', upload.single('images'), watchController.addProduct);
router.delete('/api/deleteproduct/:id', watchController.deleteProduct);




module.exports = router;
