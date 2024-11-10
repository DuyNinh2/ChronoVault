const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
    items: [
      {
        watchID: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }, // Reference to Watch
        quantity: Number,
      },
    ],
  });
  
module.exports = mongoose.model('Cart', cartSchema);
  