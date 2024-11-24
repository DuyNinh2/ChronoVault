const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  address: [
    {
      street: String,
      city: String,
      district: String,
      country: String,
    },
  ],
  created_at: { type: Date, default: Date.now },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }]
});

module.exports = mongoose.model('User', userSchema);
