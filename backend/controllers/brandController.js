const Brand = require('../models/Brand');

// Controller để lấy tất cả các brand
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();  // Kiểm tra truy vấn này có đúng không
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
};
