const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Thêm Middleware xác thực nếu cần thiết
// const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', cartController.addItemToCart); // Route: POST /api/cart/add

module.exports = router;
