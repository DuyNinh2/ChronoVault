const Order = require("../models/Order");

// Admin lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userID', 'username')
            .populate('items.watchID', 'name')
            .populate('assignedStaff', 'username');

        if (!orders.length) {
            return res.status(404).json({ message: 'Không có đơn hàng nào' });
        }

        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra', error: error.message });
    }
};

// Admin gán đơn hàng cho Staff
exports.assignOrderToStaff = async (req, res) => {
    const { orderId, staffId } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order không tồn tại" });
        }

        // Gán staff cho đơn hàng
        order.assignedStaff = staffId;
        await order.save();
        res.json({ message: "Gán đơn hàng thành công", order });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
    }
};

