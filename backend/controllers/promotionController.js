const Promotion = require('../models/Promotion');// Đảm bảo rằng đường dẫn tới model Watch là chính xác

// Get một chương trình khuyến mãi bằng ID
exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id)
            .populate('watchID'); // Lấy danh sách các đồng hồ trong khuyến mãi

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        // Tính toán giá sau khi giảm cho từng đồng hồ
        const watchesWithDiscount = promotion.watchID.map(watch => {
            const discountedPrice = (watch.price * (1 - promotion.discount / 100)).toFixed(2); // Giá sau giảm
            return {
                ...watch.toObject(), // Chuyển đối tượng watch sang dạng plain object
                discountedPrice, // Thêm trường discountedPrice vào đối tượng watch
            };
        });

        // Trả về chương trình khuyến mãi và các đồng hồ đã tính giá giảm
        res.status(200).json({
            promotionName: promotion.promotionName,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
            discount: promotion.discount,
            watches: watchesWithDiscount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving promotion', error });
    }
};


exports.getAllPromotion = async (req, res) => {
    try {
        const promotions = await Promotion.find().populate('watchID');
        res.status(200).json(promotions);
    } catch (error) {
        console.error('Error fetching promotions:', error);
        res.status(500).json({ message: 'Error fetching promotions' });
    }
};

exports.addPromotion = async (req, res) => {
    try {
        const { promotionName, startDate, endDate, discount, selectedWatches } = req.body;

        console.log("Adding promotion:", req.body);  // Log incoming data

        const promotion = new Promotion({
            promotionName,
            startDate,
            endDate,
            discount,
            watchID: selectedWatches,
        });

        await promotion.save();

        res.status(201).json({
            message: 'Promotion added successfully',
            promotion
        });
    } catch (error) {
        console.error('Error adding promotion:', error);
        res.status(500).json({ message: 'Error adding promotion' });
    }
};

exports.updatePromotion = async (req, res) => {
    const { id } = req.params; // Lấy ID khuyến mãi từ URL
    const { promotionName, startDate, endDate, discount, selectedWatches } = req.body;

    try {
        const updatedPromotion = await Promotion.findByIdAndUpdate(
            id,
            { promotionName, startDate, endDate, discount, selectedWatches },
            { new: true } // Trả về tài liệu đã cập nhật
        );

        if (!updatedPromotion) {
            return res.status(404).json({ message: "Promotion not found" });
        }

        res.status(200).json(updatedPromotion);
    } catch (error) {
        res.status(500).json({ message: "Error updating promotion", error });
    }
};

exports.deletePromotion = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPromotion = await Promotion.findByIdAndDelete(id);

        if (!deletedPromotion) {
            return res.status(404).json({ message: "Promotion not found" });
        }

        res.status(200).json({ message: "Promotion deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting promotion", error });
    }
};
