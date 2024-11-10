const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    watchID: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }, // Reference to Watch
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
    rating: Number,
    comment: String,
    created_at: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Review', reviewSchema);
  