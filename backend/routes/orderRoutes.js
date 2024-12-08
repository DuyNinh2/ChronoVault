const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get("/getAllOrders", orderController.getAllOrders); // Kiểm tra phương thức `getAllOrders` có đúng không
router.post("/assignOrderToStaff", orderController.assignOrderToStaff); // Kiểm tra phương thức `assignOrderToStaff`
router.get('/user/:userID', orderController.fetchUserOrders);


module.exports = router;
