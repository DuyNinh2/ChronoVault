import React, { Component } from 'react';
import '../../Admin/styles/StatisticsManagement.scss';

class StatisticsManagement extends Component {
    state = {
        selectedManagement: 'statistics',
        year: '',
        month: '',
        searchTerm: '',
        statistics: [
            { id: 1, order: 'Order A', amount: 2, bookingDate: '2024-01-10', price: 100 },
            { id: 2, order: 'Order B', amount: 1, bookingDate: '2024-02-15', price: 150 },
            // Add more sample data as needed
        ],
        filteredStatistics: [],
    };

    componentDidMount() {
        this.setState({ filteredStatistics: this.state.statistics });
    }

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

    filterStatistics = () => {
        const { statistics, searchTerm, year, month } = this.state;
        const filtered = statistics.filter((stat) => {
            const matchesSearch =
                stat.id.toString().includes(searchTerm) ||
                stat.order.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesYear = year ? stat.bookingDate.includes(year) : true;
            const matchesMonth = month ? stat.bookingDate.includes(`-${month}-`) : true;
            return matchesSearch && matchesYear && matchesMonth;
        });
        this.setState({ filteredStatistics: filtered });
    };

    getTotals = () => {
        const { filteredStatistics } = this.state;
        const totalRevenue = filteredStatistics.reduce((total, stat) => total + stat.price * stat.amount, 0);
        const totalAmount = filteredStatistics.reduce((total, stat) => total + stat.amount, 0);
        return { totalRevenue, totalAmount };
    };

    render() {
        const { totalRevenue, totalAmount } = this.getTotals(); // Lấy tổng doanh thu và số lượng

        return (
            <div className="statistics-management">
                <div className="display-content">
                    <h2>Statistics Management</h2>
                    <div className="statistics-actions">
                        <input
                            type="text"
                            placeholder="Search by ID or Order"
                            value={this.state.searchTerm}
                            onChange={this.handleSearch}
                        />
                        <select value={this.state.year} onChange={this.handleYearChange}>
                            <option value="">Year</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            {/* Add more years as needed */}
                        </select>
                        <select value={this.state.month} onChange={this.handleMonthChange}>
                            <option value="">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            {/* Add more months as needed */}
                        </select>
                    </div>

                    {/* Hiển thị tổng doanh thu và tổng số lượng ngoài bảng */}
                    <div className="totals">
                        <span>Total Revenue: {totalRevenue}</span>
                        <span>Total Amount: {totalAmount}</span>
                    </div>

                    <table className="statistics-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order</th>
                                <th>Amount</th>
                                <th>Booking Date</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.filteredStatistics.map((stat) => (
                                <tr key={stat.id}>
                                    <td>{stat.id}</td>
                                    <td>{stat.order}</td>
                                    <td>{stat.amount}</td>
                                    <td>{stat.bookingDate}</td>
                                    <td>{stat.price}</td>
                                    <td>Completed</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default StatisticsManagement;
