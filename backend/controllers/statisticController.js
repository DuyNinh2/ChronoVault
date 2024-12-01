const Order = require("../models/Order");

exports.getCompletedOrders = async (req, res) => {
    try {
        // Lấy danh sách các đơn hàng đã hoàn thành
        const completedOrders = await Order.find({ status: "Completed" })
            .populate('userID', 'username')
            .populate('assignedStaff', 'username')
            .populate('items.watchID', 'name');

        // Lấy danh sách top 5 người dùng chi tiêu nhiều nhất
        const topUsers = await Order.aggregate([
            { $match: { status: 'Completed' } },
            {
                $group: {
                    _id: '$userID',
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$total_amount' },
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo',
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 },
        ]);

        // Lấy danh sách top 5 nhân viên có số lượng đơn cao nhất
        const topStaff = await Order.aggregate([
            { $match: { status: 'Completed' } },
            {
                $group: {
                    _id: '$assignedStaff',
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$total_amount' },
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'staffInfo',
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 },
        ]);

        // Lấy danh sách top 5 đồng hồ được bán nhiều nhất
        const topWatches = await Order.aggregate([
            { $match: { status: 'Completed' } },
            { $unwind: '$items' }, // Tách các item trong đơn hàng
            {
                $group: {
                    _id: '$items.watchID', // Nhóm theo watchID
                    totalSold: { $sum: '$items.quantity' }, // Tổng số lượng bán
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }, // Tổng doanh thu
                }
            },
            {
                $lookup: {
                    from: 'watches',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'watchInfo'
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 } // Chỉ lấy 5 đồng hồ đứng đầu
        ]);

        res.json({
            statistics: completedOrders,
            topUsers,
            topStaff,
            topWatches, // Trả về thông tin topWatches
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Error fetching statistics' });
    }
};

