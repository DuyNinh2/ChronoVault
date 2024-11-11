const Cart = require('../models/Cart');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const newItem = new Cart(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Error adding item to cart', error });
    }
};

// Get cart items for a user
exports.getCartItems = async (req, res) => {
    try {
        const items = await Cart.find({ userId: req.params.userId });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart items', error });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
};
