import React, { Component } from 'react';
import '../../Admin/styles/UserManagement.scss';

class UserManagement extends Component {
    state = {
        selectedManagement: 'user',
        searchTerm: '',
        users: [
            { id: 1, username: 'JohnDoe', email: 'johndoe@example.com', phone: '0123456789', password: 'password123' },
            { id: 2, username: 'JaneSmith', email: 'janesmith@example.com', phone: '0987654321', password: 'password456' },
            { id: 3, username: 'AliceBrown', email: 'alicebrown@example.com', phone: '0234567891', password: 'password789' },
            { id: 4, username: 'BobJohnson', email: 'bobjohnson@example.com', phone: '0345678912', password: 'password101' },
        ],
        selectedUser: null,
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

    render() {
        const { searchTerm, users, selectedUser } = this.state;
        const filteredUsers = users.filter(user =>
            user.id.toString().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedUser) {
            return (
                <div className="user-detail-form">
                    <div className="form-header">
                        <button className="back-button" onClick={this.handleBackClick}>Back</button>
                        <h3>User Account</h3>
                    </div>
                    <hr />
                    <div className="form-group">
                        <label>ID:</label>
                        <input type="text" value={selectedUser.id} readOnly />
                    </div>
                    <div className="form-group">
                        <label>User Name:</label>
                        <input type="text" value={selectedUser.username} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="text" value={selectedUser.email} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Phone:</label>
                        <input type="text" value={selectedUser.phone} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="text" value={selectedUser.password} readOnly />
                    </div>
                    <div className="form-actions">
                        <button className="back-button" onClick={this.handleBackClick}>Back</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="admin-usermanagement">
                <div className="admin-usermanagement-content">
                    <div className="display-content">
                        <h2>User Management</h2>
                        <div className="user-actions">
                            <input
                                type="text"
                                placeholder="Search by ID, username, or email"
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
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td className="options">
                                            <button className="detail-btn" onClick={() => this.handleDetailClick(user)}>Detail</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserManagement;
