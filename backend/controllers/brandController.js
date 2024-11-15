const Brand = require('../models/Brand');

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        console.error("Error fetching brands:", error); // Log lỗi chi tiết
        res.status(500).json({ message: 'Lỗi khi lấy thông tin thương hiệu', error: error.message });
    }
};
