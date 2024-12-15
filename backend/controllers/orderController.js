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

// exports.createOrder = (req, res) => {
//     const { userID, total_amount, delivery_date, assignedStaff, items } = req.body;
//     const newOrder = new Order({ userID, total_amount, delivery_date, assignedStaff, items });
//     newOrder.save()
//         .then(order => res.json(order))
//         .catch(err => res.status(500).json({ error: 'Error creating order' }));
// };
exports.createOrder = (req, res) => {
    const { userID, total_amount, delivery_date, assignedStaff, items } = req.body;
    const newOrder = new Order({ userID, total_amount, delivery_date, assignedStaff, items });

    newOrder.save()
        .then(order => {
            // Emit new order notification to all connected clients
            io.emit('newOrderNotification', { orderId: order._id, userID: order.userID });
            res.json(order);
        })
        .catch(err => res.status(500).json({ error: 'Error creating order' }));
};

exports.fetchUserOrders = async (req, res) => {
    const userID = req.params.userID;
    try {
        const orders = await Order.find({ userID }).populate('items.watchID');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

let io;

const setSocketIo = (socketIo) => {
    io = socketIo;
};

exports.setSocketIo = setSocketIo;
// Fetch the count of new orders (e.g., orders placed within the last 24 hours)
// Đếm số lượng đơn hàng mới
exports.getNewOrdersCount = async (req, res) => {
    try {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        const newOrdersCount = await Order.countDocuments({
            order_date: { $gte: yesterday },
            status: { $ne: 'Completed' },
            seen: false,  // Thêm điều kiện chỉ tính những đơn hàng chưa được xem
        });

        // Gửi thông báo qua WebSocket khi có đơn hàng mới
        io.emit('newOrderNotification', newOrdersCount);

        res.json({ count: newOrdersCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra', error: error.message });
    }
};

// Lấy danh sách đơn hàng mới chưa được xem
exports.getNewOrders = async (req, res) => {
    try {
        const newOrders = await Order.find({ status: 'Pending', seen: false })
            .populate('userID')
            .populate('assignedStaff')
            .populate('items.watchID')
            .exec();

        res.status(200).json({ orders: newOrders });
    } catch (error) {
        console.error('Error getting new orders:', error);
        res.status(500).json({ message: 'Error fetching new orders' });
    }
};

exports.markOrderAsSeen = async (req, res) => {
    try {
        const orderId = req.params.orderId; // Lấy orderId từ URL params
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { seen: true }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order marked as seen', order: updatedOrder });
    } catch (error) {
        console.error('Error marking order as seen:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get the 10 most recent orders with 'seen' status
exports.getRecentSeenOrders = async (req, res) => {
    try {
        // Fetch the 10 most recent orders where 'seen' is true
        const recentOrders = await Order.find({ seen: true })
            .sort({ order_date: -1 })  // Sort by order date in descending order
            .limit(10)  // Limit to the 10 most recent orders
            .populate('userID', 'username')
            .populate('items.watchID', 'name')
            .populate('assignedStaff', 'username');

        if (!recentOrders.length) {
            return res.status(404).json({ message: 'Không có đơn hàng nào đã xem' });
        }

        res.json({ orders: recentOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra', error: error.message });
    }
};


