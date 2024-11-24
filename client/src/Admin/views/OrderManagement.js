import React, { Component } from 'react';
import axios from 'axios';
import '../../Admin/styles/OrderManagement.scss';

class OrderManagement extends Component {
    state = {
        searchTerm: '',
        orders: [],
        staffList: [],
    };

    // Lấy danh sách đơn hàng và nhân viên
    componentDidMount() {
        this.fetchOrders();
        this.fetchStaffList();
    }

    fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders/getAllOrders');
            if (response.data.orders) {
                this.setState({ orders: response.data.orders });
            }
        } catch (error) {
            console.error('Có lỗi khi lấy dữ liệu đơn hàng:', error);
        }
    };

    fetchStaffList = async () => {
        try {
            const response = await axios.get('/api/staff/getAllStaff');
            if (response.data.staff) {
                this.setState({ staffList: response.data.staff });
            }
        } catch (error) {
            console.error('Có lỗi khi lấy dữ liệu nhân viên:', error);
        }
    };

    handleUpdateAssignedStaff = async (orderId, staffId) => {
        try {
            const response = await axios.post('/api/orders/assignOrderToStaff', {
                orderId,
                staffId,
            });
            if (response.data.order) {
                this.setState(prevState => ({
                    orders: prevState.orders.map(order =>
                        order._id === orderId
                            ? { ...order, assignedStaff: { _id: staffId, username: response.data.order.assignedStaff.username } }
                            : order
                    ),
                }));
            }
        } catch (error) {
            console.error('Có lỗi khi gán nhân viên giao hàng:', error);
        }
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        const { searchTerm, orders, staffList } = this.state;

        // Lọc đơn hàng theo từ khóa tìm kiếm
        const filteredOrders = orders.filter(order =>
            order._id.includes(searchTerm) ||
            (order.order_date && order.order_date.includes(searchTerm))
        );

        return (
            <div className="order-management">
                <div className="display-content">
                    <h2>Order Management</h2>
                    <div className="order-actions">
                        <input
                            type="text"
                            placeholder="Search by ID or Booking Date"
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                        />
                    </div>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>ID Order</th>
                                <th>User</th>
                                <th>Watch - Amount - Price</th>
                                <th>Total Amount</th>
                                <th>Order Date</th>
                                <th>Status</th>
                                <th>Assigned Staff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.userID?.username || 'Unknown'}</td>
                                    <td>
                                        {order.items.map((item, index) => (
                                            <div key={index}>
                                                {item.watchID?.name || 'Unknown'} - Amount: {item.quantity} - Price: {item.price}
                                            </div>
                                        ))}
                                    </td>


                                    {/* <td>{order.items?.length || 0}</td> */}
                                    <td>{order.total_amount}</td>
                                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                    <td>{order.status}</td> {/* Chỉ xem, không chỉnh sửa */}
                                    <td>
                                        {order.assignedStaff ? (
                                            order.assignedStaff.username
                                        ) : (
                                            <select
                                                onChange={(e) =>
                                                    this.handleUpdateAssignedStaff(order._id, e.target.value)
                                                }
                                            >
                                                <option value="">Select Staff</option>
                                                {staffList.map(staff => (
                                                    <option key={staff._id} value={staff._id}>
                                                        {staff.username}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default OrderManagement;
