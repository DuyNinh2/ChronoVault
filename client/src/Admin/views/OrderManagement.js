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
        filterIncompleteOrders: false,
        filterOrdersToday: false,
        filterMonth: '', // Bộ lọc theo tháng
        filterYear: '',  // Bộ lọc theo năm
    };

    componentDidMount() {
        this.fetchOrders();
        this.fetchStaffList();
    }


    // Lấy danh sách đơn hàng
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

    // Lấy danh sách nhân viên
    fetchStaffList = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get('/api/staff/getAllStaff', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            this.setState({ staffList: response.data.staff });
        } catch (error) {
            console.error('Có lỗi khi lấy dữ liệu nhân viên:', error);
        }
    };

    // Gán nhân viên giao hàng cho đơn
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

    // Xử lý thay đổi tìm kiếm
    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    // Bật/tắt bộ lọc đơn chưa hoàn thành
    toggleIncompleteOrdersFilter = () => {
        this.setState(prevState => ({
            filterIncompleteOrders: !prevState.filterIncompleteOrders
        }));
    };

    // Bộ lọc theo tháng
    handleFilterMonth = (event) => {
        this.setState({ filterMonth: event.target.value });
    };

    // Bộ lọc theo năm
    handleFilterYear = (event) => {
        this.setState({ filterYear: event.target.value });
    };

    // Lọc theo ngày hôm nay
    isToday = (dateString) => {
        const today = new Date();
        const orderDate = new Date(dateString);
        return (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
        );
    };

    // Lọc theo tháng và năm
    filterByDate = (orders) => {
        const { filterMonth, filterYear } = this.state;

        return orders.filter(order => {
            const orderDate = new Date(order.order_date);
            const matchesMonth = filterMonth ? (orderDate.getMonth() + 1).toString() === filterMonth : true;
            const matchesYear = filterYear ? orderDate.getFullYear().toString() === filterYear : true;

            return matchesMonth && matchesYear;
        });
    };

    render() {
        const { searchTerm, orders, staffList, currentPage, productsPerPage, filterIncompleteOrders, filterOrdersToday, filterMonth, filterYear } = this.state;

        // Lọc đơn hàng
        let filteredOrders = orders.filter(order =>
            order._id.includes(searchTerm) ||
            (order.order_date && order.order_date.includes(searchTerm))
        );

        // Lọc đơn chưa hoàn thành
        if (filterIncompleteOrders) {
            filteredOrders = filteredOrders.filter(order => order.status !== 'Completed');
        }

        // Lọc đơn trong ngày
        if (filterOrdersToday) {
            filteredOrders = filteredOrders.filter(order => this.isToday(order.order_date));
        }

        // Lọc theo tháng và năm
        filteredOrders = this.filterByDate(filteredOrders);

        // Phân trang
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = filteredOrders.slice(indexOfFirstProduct, indexOfLastProduct);
        const totalPages = Math.ceil(filteredOrders.length / productsPerPage);

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
                        <button onClick={() => this.setState({ filterOrdersToday: !filterOrdersToday })}>
                            {filterOrdersToday ? 'Show All Orders' : 'Show Today’s Orders'}
                        </button>
                        <select value={filterMonth} onChange={this.handleFilterMonth}>
                            <option value="">Select Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{`Month ${i + 1}`}</option>
                            ))}
                        </select>
                        <select value={filterYear} onChange={this.handleFilterYear}>
                            <option value="">Select Year</option>
                            {[2022, 2023, 2024].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
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
                                ))
                            ) : (
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
