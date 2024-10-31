import React, { Component } from 'react';
import '../../Admin/styles/UserManagement.scss';
import DetailUser from '../components/ui/DetailUser'; // Import component DetailUser

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
                    {selectedUser && (
                        <DetailUser user={selectedUser} onBackClick={this.handleBackClick} />
                    )}
                </div>
            </div>
        );
    }
}

export default UserManagement;
