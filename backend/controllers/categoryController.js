const Category = require('../models/Category');

// Controller để lấy tất cả các category
exports.getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find();  // Kiểm tra truy vấn này có đúng không
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};
