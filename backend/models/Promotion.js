const mongoose = require("mongoose");
 
const promotionSchema = new mongoose.Schema({
  promotionName: String,
  startDate: Date,
  endDate: Date,
  discount: Number,
  watchID: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }, // Reference to Watch
});

module.exports = mongoose.model('Promotion', promotionSchema);