const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: "Pending" },
  total_amount: Number,
  order_date: { type: Date, default: Date.now },
  delivery_date: Date,
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  items: [
    {
      watchID: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch' },
      quantity: Number,
      price: Number
    },
  ],
});

module.exports = mongoose.model('Order', orderSchema);
