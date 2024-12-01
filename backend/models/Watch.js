const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock_quantity: { type: Number, required: true },
  brandID: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true }, // Reference to Brand
  price: { type: Number, required: true },
  description: { type: String },
  //category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [
    {
      image_url: { type: String, required: true },
      alt_text: { type: String }
    },
    {
      image_url: { type: String, required: true },
      alt_text: { type: String }
    },
    {
      image_url: { type: String, required: true },
      alt_text: { type: String }
    }
  ],
  isDeleted: { type: Boolean, default: false }, // Reference to Category
});

module.exports = mongoose.model('Watch', watchSchema);
