const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/api/cart/add', cartController.addItemToCart); 
router.post('/api/cart', cartController.getCartItems);
router.post('/api/cart/updatequantity', cartController.updateCartQuantity); 
router.post('/api/cart/removewatch', cartController.removeCartItem);
router.delete('/api/cart/:userID', cartController.clearCartItems);

module.exports = router;
