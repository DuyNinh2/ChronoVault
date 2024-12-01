// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get("/getAllOrders", orderController.getAllOrders); // Kiểm tra phương thức `getAllOrders` có đúng không
router.post("/assignOrderToStaff", orderController.assignOrderToStaff); // Kiểm tra phương thức `assignOrderToStaff`



module.exports = router;
