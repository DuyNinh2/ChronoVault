import React, { Component } from 'react';
import '../../Admin/styles/OrderManagement.scss'; // Import SCSS cho giao diện

class OrderManagement extends Component {
    state = {
        searchTerm: '',
        orders: [
            { id: 1, orderName: 'Order 1', userId: 'User 1', amount: '1', bookingDate: '2024-01-01', status: 'Duyệt đơn hàng' },
            { id: 2, orderName: 'Order 2', userId: 'User 2', amount: '2', bookingDate: '2024-01-02', status: 'Đang giao hàng' },
            { id: 3, orderName: 'Order 3', userId: 'User 3', amount: '1', bookingDate: '2024-01-03', status: 'Đã giao hàng' },
            // Thêm các đơn hàng khác tại đây
        ],
    };

    handleUpdateOrderStatus = (id, newStatus) => {
        this.setState(prevState => ({
            orders: prevState.orders.map(order =>
                order.id === id ? { ...order, status: newStatus } : order
            )
        }));
    };

    handleAddOrder = () => {
        // Logic để thêm đơn hàng mới
        console.log("Add order functionality");
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        const { searchTerm, orders } = this.state;

        // Lọc đơn hàng theo ID và ngày đặt
        const filteredOrders = orders.filter(order =>
            order.id.toString().includes(searchTerm) || // Tìm theo ID
            order.bookingDate.includes(searchTerm) // Tìm theo ngày đặt
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
                        <button className="add-button" onClick={this.handleAddOrder}>Add</button>
                    </div>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Orders</th>
                                <th>ID User</th>
                                <th>Amount</th>
                                <th>Booking Date</th>
                                <th>Status</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.orderName}</td>
                                    <td>{order.userId}</td>
                                    <td>{order.amount}</td>
                                    <td>{order.bookingDate}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => this.handleUpdateOrderStatus(order.id, e.target.value)}
                                        >
                                            <option value="Duyệt đơn hàng">Duyệt đơn hàng</option>
                                            <option value="Đang giao hàng">Đang giao hàng</option>
                                            <option value="Đã giao hàng">Đã giao hàng</option>
                                        </select>
                                    </td>
                                    <td className="options">
                                        <button className="update-btn" onClick={() => this.handleUpdateOrderStatus(order.id)}>Update</button>
                                        <button className="delete-btn" onClick={() => this.handleUpdateOrderStatus(order.id)}>Delete</button>
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
