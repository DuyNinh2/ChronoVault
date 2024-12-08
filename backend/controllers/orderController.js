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

exports.createOrder = (req, res) => {
    const { userID, total_amount, delivery_date, assignedStaff, items } = req.body;
    const newOrder = new Order({ userID, total_amount, delivery_date, assignedStaff, items });
    newOrder.save()
      .then(order => res.json(order))
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


