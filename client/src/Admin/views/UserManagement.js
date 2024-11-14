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
    };

    componentDidMount() {
        this.fetchUsers(); // Gọi hàm để lấy danh sách người dùng từ BE
    }

    fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/user-management'); // URL của API
            // Kiểm tra dữ liệu trước khi setState
            const users = response.data.map(user => ({
                _id: user._id || 'N/A', // Đảm bảo có ID
                username: user.username || 'Unknown', // Đảm bảo có tên người dùng
                email: user.email || 'Unknown', // Đảm bảo có email
                phone: user.phone || 'Unknown', // Đảm bảo có số điện thoại
                created_at: user.created_at || 'Unknown' // Lấy ngày tạo
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
        const { searchTerm, users, selectedUser } = this.state;
        // Thêm điều kiện để tránh lỗi undefined khi tìm kiếm
        const filteredUsers = users.filter(user =>
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );

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
                                {filteredUsers.map(user => (
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
