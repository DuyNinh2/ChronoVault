import React, { Component } from 'react';
import axios from 'axios';

import '../../Admin/styles/StatisticsManagement.scss';

class StatisticsManagement extends Component {
    state = {
        year: '',
        month: '',
        searchTerm: '',
        statistics: [],
        filteredStatistics: [],
        topUsers: [],
        topStaff: [],
        topWatches: [],
        sortByValue: false,
    };

    componentDidMount() {
        this.fetchStatistics();
    }

    fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/statistic/completedOrders');
            console.log(response.data.statistics);
            this.setState({
                statistics: response.data.statistics || [],  // Default to empty array if undefined
                filteredStatistics: response.data.statistics || [],  // Default to empty array if undefined
                topUsers: response.data.topUsers || [],  // Default to empty array if undefined
                topStaff: response.data.topStaff || [],  // Default to empty array if undefined
                topWatches: response.data.topWatches || [],
            });
        } catch (error) {
            console.error('Có lỗi khi lấy dữ liệu thống kê:', error);
        }
    };

    handleSearch = (event) => {
        const { value } = event.target;
        this.setState({ searchTerm: value }, this.filterStatistics);
    };

    handleYearChange = (event) => {
        this.setState({ year: event.target.value }, this.filterStatistics);
    };

    handleMonthChange = (event) => {
        this.setState({ month: event.target.value }, this.filterStatistics);
    };

    // Hàm lọc và sắp xếp các thống kê
    filterStatistics = () => {
        const { statistics, searchTerm, year, month, sortByValue } = this.state;
        let filtered = statistics.filter((stat) => {
            const matchesSearch =
                stat._id.toString().includes(searchTerm) ||
                stat.items.some(item => item.watchID?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesYear = year ? stat.order_date.includes(year) : true;
            const matchesMonth = month ? stat.order_date.includes(`-${month}-`) : true;
            return matchesSearch && matchesYear && matchesMonth;
        });

        // Nếu sắp xếp theo giá trị đơn hàng
        if (sortByValue) {
            filtered = filtered.sort((a, b) => {
                const totalValueA = a.items.reduce((total, item) => total + item.quantity * item.price, 0);
                const totalValueB = b.items.reduce((total, item) => total + item.quantity * item.price, 0);
                return totalValueB - totalValueA; // Sắp xếp giảm dần theo giá trị đơn hàng
            });
        }

        this.setState({ filteredStatistics: filtered });
    };

    // Thay đổi cờ sắp xếp khi người dùng nhấn nút sắp xếp
    toggleSortByValue = () => {
        this.setState(
            (prevState) => ({ sortByValue: !prevState.sortByValue }),
            this.filterStatistics
        );
    };

    getTotals = () => {
        const { filteredStatistics } = this.state;
        const totalRevenue = filteredStatistics.reduce((total, stat) =>
            total + stat.items.reduce((subTotal, item) => subTotal + item.quantity * item.price, 0), 0);
        const totalAmount = filteredStatistics.reduce((total, stat) =>
            total + stat.items.reduce((subTotal, item) => subTotal + item.quantity, 0), 0);
        return { totalRevenue, totalAmount };
    };

    render() {
        const { filteredStatistics, topUsers, topStaff, topWatches, sortByValue } = this.state;
        const { totalRevenue, totalAmount } = this.getTotals();

        return (
            <div className="statistics-management">
                <h2>Statistics Management</h2>

                {/* Thanh tìm kiếm */}
                <div className="statistics-actions">
                    <input
                        type="text"
                        placeholder="Search by Watch Name"
                        value={this.state.searchTerm}
                        onChange={this.handleSearch}
                    />
                    <select value={this.state.year} onChange={this.handleYearChange}>
                        <option value="">Year</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                    <select value={this.state.month} onChange={this.handleMonthChange}>
                        <option value="">Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>

                    {/* Nút sắp xếp theo giá trị đơn hàng */}
                    <button onClick={this.toggleSortByValue}>
                        {sortByValue ? 'Sort by Order Date' : 'Sort by Order Value'}
                    </button>
                </div>

                {/* Tổng doanh thu và số lượng */}
                <div className="totals">
                    <span>Total Revenue: {totalRevenue}</span>
                    <span>Total Amount: {totalAmount}</span>
                </div>

                {/* Hai bảng Orders và Top Users */}
                <div className="statistics-tables">
                    {/* Bảng danh sách orders */}
                    <div className="order-table">
                        <h3>Orders</h3>
                        <table className="statistics-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Items - Quantity - Price</th>
                                    <th>Order Date</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Staff</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStatistics && filteredStatistics.length > 0 ? (
                                    filteredStatistics.map((stat) => (
                                        <tr key={stat._id}>
                                            <td>{stat._id}</td>
                                            <td>
                                                {stat.items.map((item, index) =>
                                                    `${item.watchID?.name || 'Unknown'} - Quantity: ${item.quantity || 'Unknown'} - Price: ${item.price}`
                                                ).join(', ')}
                                            </td>

                                            <td>{new Date(stat.order_date).toLocaleDateString()}</td>
                                            <td>
                                                {stat.items.reduce((total, item) => total + item.quantity * item.price, 0)}
                                            </td>
                                            <td>{stat.status}</td>
                                            <td>{stat.assignedStaff?.username || 'Unknown'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7">No statistics found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Bảng Top Users */}
                    <div className="top-users">
                        <h3>Top Users</h3>
                        <table className="statistics-table-user">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Total Orders</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topUsers && topUsers.length > 0 ? (
                                    topUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.userInfo[0]?.username || 'Unknown'}</td>
                                            <td>{user.totalOrders}</td>
                                            <td>{user.totalAmount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No top users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Bảng Top Staff */}
                    <div className="top-staff">
                        <h3>Top Staff</h3>
                        <table className="statistics-table-staff">
                            <thead>
                                <tr>
                                    <th>Staff</th>
                                    <th>Total Orders</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topStaff && topStaff.length > 0 ? (
                                    topStaff.map((staff) => (
                                        <tr key={staff._id}>
                                            <td>{staff.staffInfo[0]?.username || 'Unknown'}</td>
                                            <td>{staff.totalOrders}</td>
                                            <td>{staff.totalAmount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No top staff found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Bảng Top Watches */}
                    <div className="top-watches">
                        <h3>Top Watches</h3>
                        <table className="statistics-table-watch">
                            <thead>
                                <tr>
                                    <th>Watch</th>
                                    <th>Total Sold</th>
                                    <th>Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topWatches && topWatches.length > 0 ? (
                                    topWatches.map((watch) => (
                                        <tr key={watch._id}>
                                            <td>{watch.watchInfo[0]?.name || 'Unknown'}</td>
                                            <td>{watch.totalSold}</td>
                                            <td>{watch.totalRevenue}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No top watches found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>
        );
    }
}

export default StatisticsManagement;
