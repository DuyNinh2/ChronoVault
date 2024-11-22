const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
  promotionName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  discount: { type: Number, required: true },
  watchID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }], // Ensure it's an array of ObjectIds
});

module.exports = mongoose.model('Promotion', promotionSchema);
