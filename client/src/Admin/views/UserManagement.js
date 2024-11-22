import React, { Component } from 'react';
import axios from 'axios';
import '../../Admin/styles/UserManagement.scss';
import DetailUser from '../components/ui/DetailUser';

class UserManagement extends Component {
    state = {
        selectedManagement: 'user',
        searchTerm: '',
        users: [],
        selectedUser: null,
        currentPage: 1, // Trang hiện tại
        usersPerPage: 6, // Số lượng người dùng mỗi trang
    };

    componentDidMount() {
        this.fetchUsers(); // Gọi hàm để lấy danh sách người dùng từ BE
    }

    fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/user-management');
            // Kiểm tra dữ liệu trước khi setState
            const users = response.data.map(user => ({
                _id: user._id || 'N/A',
                username: user.username || 'Unknown',
                email: user.email || 'Unknown',
                phone: user.phone || 'Unknown',
                created_at: user.created_at || 'Unknown'
            }));
            this.setState({ users });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    handleDetailClick = (user) => {
        this.setState({ selectedUser: user });
    };

    handleBackClick = () => {
        this.setState({ selectedUser: null });
    };

    formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return !isNaN(date) ? date.toLocaleDateString() : 'Invalid Date';
    };

    render() {
        const { searchTerm, users, selectedUser, currentPage, usersPerPage } = this.state;

        // Lọc dữ liệu theo tìm kiếm
        const filteredUsers = users.filter(user =>
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Tính chỉ số người dùng cần hiển thị cho trang hiện tại
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

        // Tính toán số trang
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

        return (
            <div className="admin-usermanagement">
                <div className="admin-usermanagement-content">
                    <div className="display-content">
                        <h2>User Management</h2>
                        <div className="user-actions">
                            <input
                                type="text"
                                placeholder="Search by username or email"
                                value={searchTerm}
                                onChange={this.handleSearchChange}
                            />
                        </div>
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Created At</th> {/* Cột mới cho ngày tạo */}
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{this.formatDate(user.created_at)}</td> {/* Hiển thị ngày tạo */}
                                        <td className="options">
                                            <button className="detail-btn" onClick={() => this.handleDetailClick(user)}>Detail</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
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

                    {selectedUser && (
                        <DetailUser user={selectedUser} onBackClick={this.handleBackClick} />
                    )}
                </div>
            </div>
        );
    }
}

export default UserManagement;
