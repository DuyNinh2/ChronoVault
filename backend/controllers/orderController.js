const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error creating order', error });
    }
};


