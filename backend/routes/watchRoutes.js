const express = require('express');
const router = express.Router();
const Watch = require('../models/Watch'); 
const Brand = require('../models/Brand'); 
const Category = require('../models/Category'); 

// Route để lấy tất cả các sản phẩm
router.get('/products', async (req, res) => {
  try {
    const products = await Watch.find()
      .populate('brandID')      // Tham chiếu đến Brand
      .populate('category_id'); // Tham chiếu đến Category
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
