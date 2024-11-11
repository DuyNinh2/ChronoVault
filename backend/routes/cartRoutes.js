const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.addToCart);
router.get('/:userId', cartController.getCartItems);
router.delete('/:id', cartController.removeFromCart);

module.exports = router;
