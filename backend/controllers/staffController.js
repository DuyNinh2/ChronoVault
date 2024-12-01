const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");
const Order = require("../models/Order");

exports.loginStaff = async (req, res) => {
    try {
        const { username, password } = req.body;
        const staff = await Staff.findOne({ username });

        if (!staff || staff.password !== password) {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu!" });
        }

        if (staff.role !== "Shipper") {
            return res.status(403).json({ message: "Bạn không có quyền đăng nhập vào hệ thống staff!" });
        }

        const token = jwt.sign(
            { id: staff._id, role: staff.role },
            "SECRET_KEY",
            { expiresIn: "1h" }
        );

        console.log("Đăng nhập thành công!");
        return res.status(200).json({
            token,
            staffId: staff._id,
            username: staff.username,
            role: staff.role,
        });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

exports.getAssignedOrders = async (req, res) => {
    const staffId = req.user.id;
    try {
        const orders = await Order.find({ assignedStaff: staffId })
            .populate('userID')
            .populate('items.watchID');
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order không tồn tại" });
        }

        if (order.assignedStaff.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền thay đổi đơn hàng này" });
        }

        order.status = status;
        await order.save();
        res.json({ message: "Cập nhật trạng thái thành công", order });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
    }
};

exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find().select("_id username");
        console.log("Staff data:", staff);  // Kiểm tra dữ liệu trả về
        if (!staff || staff.length === 0) {
            return res.status(400).json({ message: "Không có nhân viên nào" });
        }
        res.json({ staff });
    } catch (error) {
        console.error("Chi tiết lỗi:", error.message);
        res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
    }
};









