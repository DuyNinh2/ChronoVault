const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Reference to Order
    date: Date,
    amount: Number,
    price: Number,
  });
  
module.exports = mongoose.model('Statistics', statisticsSchema);
  