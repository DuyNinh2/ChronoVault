const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  name: String,
  stock_quantity: Number,
  brandID: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }, // Reference to Brand
  price: Number,
  description: String,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Reference to Category
  images: [
    {
        image_url: String,
        alt_text: String
      },
      {
        image_url: String,
        alt_text: String
      },
      {
        image_url: String,
        alt_text: String
      }
  ],
});

module.exports = mongoose.model('Watch', watchSchema);
