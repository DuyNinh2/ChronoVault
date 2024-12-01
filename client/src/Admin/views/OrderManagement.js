import React, { Component } from 'react';
import axios from 'axios';
import '../../Admin/styles/OrderManagement.scss';

class OrderManagement extends Component {
    state = {
        searchTerm: '',
        orders: [],
        staffList: [],
        currentPage: 1,
        productsPerPage: 6,
        filterIncompleteOrders: false, // Thêm một trạng thái để lọc đơn hàng chưa hoàn thành
    };

    componentDidMount() {
        this.fetchOrders();
        this.fetchStaffList();
    }

    // Fetch all orders
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

    // Fetch all staff
    fetchStaffList = async () => {
        const token = localStorage.getItem("token"); // Lấy token một lần duy nhất
        console.log("Token sent:", token);
        try {
            const response = await axios.get('/api/staff/getAllStaff', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Dữ liệu nhận được từ API:', response.data.staff); // Kiểm tra dữ liệu nhận được
            this.setState({ staffList: response.data.staff });
        } catch (error) {
            console.error('Có lỗi khi lấy dữ liệu nhân viên:', error);
        }
    };

    // Update assigned staff for an order
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
                            ? { ...order, assignedStaff: response.data.order.assignedStaff }
                            : order
                    ),
                }));
                window.alert('Assigned staff successfully!');
                this.fetchOrders();
            }
        } catch (error) {
            console.error('Có lỗi khi gán nhân viên giao hàng:', error);
        }
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    // Toggle filter for incomplete orders
    toggleIncompleteOrdersFilter = () => {
        this.setState(prevState => ({
            filterIncompleteOrders: !prevState.filterIncompleteOrders
        }));
    };

    render() {
        const { searchTerm, orders, staffList, currentPage, productsPerPage, filterIncompleteOrders } = this.state;

        // Filter orders based on search term
        const filteredOrders = orders.filter(order =>
            order._id.includes(searchTerm) ||
            (order.order_date && order.order_date.includes(searchTerm))
        );

        // Apply additional filter for incomplete orders
        const incompleteOrders = filterIncompleteOrders
            ? filteredOrders.filter(order => order.status !== 'Completed') // Giả sử trạng thái "Completed" là hoàn thành
            : filteredOrders;

        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = incompleteOrders.slice(indexOfFirstProduct, indexOfLastProduct);
        const totalPages = Math.ceil(incompleteOrders.length / productsPerPage);

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
                        <button onClick={this.toggleIncompleteOrdersFilter}>
                            {filterIncompleteOrders ? 'Show All Orders' : 'Show Incomplete Orders'}
                        </button>
                    </div>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>ID Order</th>
                                <th>User</th>
                                <th>Watch - Quantity - Price</th>
                                <th>Total Amount</th>
                                <th>Order Date</th>
                                <th>Status</th>
                                <th>Assigned Staff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.length > 0 ? (
                                currentProducts.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.userID?.username || 'Unknown'}</td>
                                        <td>
                                            {order.items.map((item, index) => (
                                                <div key={index}>
                                                    {item.watchID?.name || 'Unknown'} - Quantity: {item.quantity} - Price: {item.price}
                                                </div>
                                            ))}
                                        </td>
                                        <td>{order.total_amount}</td>
                                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                        <td>{order.status}</td>
                                        <td>
                                            <div className="staff-actions">
                                                {order.assignedStaff ? (
                                                    <>
                                                        <span className="staff-name">{order.assignedStaff?.username || "Staff"}</span>
                                                        <select
                                                            value={order.assignedStaff ? order.assignedStaff._id : ""}
                                                            onChange={(e) => this.handleUpdateAssignedStaff(order._id, e.target.value)}
                                                        >
                                                            <option value="">Change Staff</option>
                                                            {staffList.map((staff) => (
                                                                <option key={staff._id} value={staff._id}>
                                                                    {staff.username}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </>
                                                ) : (
                                                    <select
                                                        value={order.assignedStaff ? order.assignedStaff._id : ""}
                                                        onChange={(e) => this.handleUpdateAssignedStaff(order._id, e.target.value)}
                                                    >
                                                        <option value="">Select Staff</option>
                                                        {staffList.map((staff) => (
                                                            <option key={staff._id} value={staff._id}>
                                                                {staff.username}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="7">No orders available</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <button
                        onClick={() => this.setState({ currentPage: currentPage - 1 })}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => this.setState({ currentPage: currentPage + 1 })}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }
}

export default OrderManagement;
