const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
    status: String,
    total_amount: Number,
    order_date: { type: Date, default: Date.now },
    delivery_date: Date,
    items: [
      {
        watchID: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }, // Reference to Watch
        quantity: Number,
        price: Number, // Store the price at the time of purchase
      },
    ],
  });
  
module.exports = mongoose.model('Order', orderSchema);
  