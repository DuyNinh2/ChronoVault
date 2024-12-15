import React, { Component } from 'react';
import axios from 'axios';
import io from "socket.io-client";
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
        filterMonth: '',
        filterYear: '',
        newOrdersCount: 0,
        showNewOrders: false, // Add state to track if new orders are being displayed
        newOrders: [],
        selectedOrder: null,
        seenOrders: [] // Add newOrders state
    };

    constructor(props) {
        super(props);
        this.notificationRef = React.createRef(); // Tạo ref cho thông báo
    }

    handleNotificationClick = (orderId) => {
        const { showNewOrders, newOrders } = this.state;

        // Nếu thông báo chưa được hiển thị thì mở thông báo xổ xuống
        if (!showNewOrders) {
            this.setState({ showNewOrders: true });
        }

        setTimeout(() => {
            // Mark order as seen after the delay
            axios.post(`/api/orders/markOrderAsSeen/${orderId}`)
                .then(() => {
                    // Remove the order from the newOrders list after it's marked as seen
                    this.setState(prevState => ({
                        newOrders: prevState.newOrders.filter(order => order._id !== orderId),
                        newOrdersCount: prevState.newOrdersCount - 1, // Update the notification count
                    }));

                    // Update the count of new orders
                    this.fetchNewOrdersCount();
                })
                .catch(error => {
                    console.error('Error marking order as seen:', error);
                });
        }, 3000); // 3-second delay
    };

    componentDidMount() {
        this.fetchOrders();
        this.fetchStaffList();
        this.fetchRecentSeenOrders(); // Fetch the recent seen orders
        this.socket = io('http://localhost:5000'); // Kết nối tới WebSocket server

        // Lắng nghe sự kiện WebSocket về đơn hàng mới
        this.socket.on('newOrderNotification', (count) => {
            this.setState({ newOrdersCount: count });
        });

        this.fetchNewOrdersCount();
        this.fetchNewOrders();
    };


    fetchRecentSeenOrders = async () => {
        try {
            const response = await axios.get('/api/orders/getRecentSeenOrders');
            if (response.data.orders) {
                this.setState({ seenOrders: response.data.orders });
            }
        } catch (error) {
            console.error('Error fetching recent seen orders:', error);
        }
    };


    // Fetch new orders count
    fetchNewOrdersCount = async () => {
        try {
            const response = await axios.get('/api/orders/getNewOrdersCount');
            if (response.data && response.data.count !== undefined) {
                this.setState({ newOrdersCount: response.data.count });
            }
        } catch (error) {
            console.error('Có lỗi khi lấy số lượng đơn hàng mới:', error);
        }
    };

    // Fetch new orders
    fetchNewOrders = async () => {
        try {
            const response = await axios.get('/api/orders/getNewOrders');
            if (response.data.orders) {
                this.setState({ newOrders: response.data.orders });
            }
        } catch (error) {
            console.error('Error fetching new orders:', error);
        }
    };

    closeNotification = () => {
        // Close the notification dropdown
        this.setState({ showNewOrders: false });
    };
    // Fetch orders
    fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders/getAllOrders');
            if (response.data.orders) {
                this.setState({ orders: response.data.orders });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Fetch staff list
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
            console.error('Error fetching staff data:', error);
        }
    };

    // Assign staff to an order
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
            console.error('Error assigning staff:', error);
        }
    };

    // Handle search input change
    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    // Toggle incomplete orders filter
    toggleIncompleteOrdersFilter = () => {
        this.setState(prevState => ({
            filterIncompleteOrders: !prevState.filterIncompleteOrders
        }));
    };

    // Handle filter by month
    handleFilterMonth = (event) => {
        this.setState({ filterMonth: event.target.value });
    };

    // Handle filter by year
    handleFilterYear = (event) => {
        this.setState({ filterYear: event.target.value });
    };

    // Check if the order was made today
    isToday = (dateString) => {
        const today = new Date();
        const orderDate = new Date(dateString);
        return (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
        );
    };

    // Filter orders by date (month and year)
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
        const { searchTerm, orders, staffList, currentPage, productsPerPage, filterIncompleteOrders, filterOrdersToday, filterMonth, filterYear, newOrdersCount, showNewOrders, newOrders, selectedOrder } = this.state;

        // Filter orders
        let filteredOrders = orders.filter(order =>
            order._id.includes(searchTerm) ||
            (order.order_date && order.order_date.includes(searchTerm))
        );

        // Filter incomplete orders
        if (filterIncompleteOrders) {
            filteredOrders = filteredOrders.filter(order => order.status !== 'Completed');
        }

        // Filter orders made today
        if (filterOrdersToday) {
            filteredOrders = filteredOrders.filter(order => this.isToday(order.order_date));
        }

        // Filter by month and year
        filteredOrders = this.filterByDate(filteredOrders);

        // Pagination
        const indexOfLastOrder = currentPage * productsPerPage;
        const indexOfFirstOrder = indexOfLastOrder - productsPerPage;
        const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
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
                        <button className='show' onClick={this.toggleIncompleteOrdersFilter}>
                            {filterIncompleteOrders ? 'Show All' : 'Show Incomplete'}
                        </button>
                        <button className='show' onClick={() => this.setState({ filterOrdersToday: !filterOrdersToday })}>
                            {filterOrdersToday ? 'Show All' : 'Show Today'}
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
                        <div className="notification" ref={this.notificationRef}>
                            <button className='notification-btn'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (newOrdersCount > 0) {
                                        this.handleNotificationClick(newOrders[0]._id);
                                    }
                                }}>
                                🔔
                                {newOrdersCount > 0 && (
                                    <span className="notification-count">{newOrdersCount}</span>
                                )}
                            </button>
                        </div>


                        {showNewOrders && (
                            <div className="new-orders-dropdown">
                                <button className="close-btn" onClick={this.closeNotification}>X</button>
                                {newOrders.length > 0 ? (
                                    newOrders.map(order => (
                                        <div key={order._id} className="order-item">
                                            <p>Order ID: {order._id}</p>
                                            <p>User: {order.userID?.username || 'Unknown'}</p>
                                            <p>Total: {order.total_amount}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No new orders</p>
                                )}
                            </div>
                        )}

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
                            {currentOrders.length > 0 ? (
                                currentOrders.map(order => (
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

            </div >
        );
    }
}

export default OrderManagement;
