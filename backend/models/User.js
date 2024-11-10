const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: String,
  address: [
    {
      street: String,
      city: String,
      district: String,
      country: String,
    },
  ],
  created_at: { type: Date, default: Date.now },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }] // Reference to Watch
});

module.exports = mongoose.model('User', userSchema);
