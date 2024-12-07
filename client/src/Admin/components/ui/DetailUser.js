import React, { Component } from "react";
import '../../styles/DetailUser.scss';

class DetailUser extends Component {
    formatDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date) ? date.toLocaleDateString() : 'Unknown';
    };

    render() {
        const { user, onBackClick } = this.props; // Nhận thông tin user và hàm trở lại từ props

        if (!user) {
            return null; // Nếu không có user, không render gì
        }

        return (
            <div className="admin-detailuser-overlay">
                <div className="admin-detailuser-form">
                    <button className="admin-detailuser-back-button" onClick={onBackClick}>Back</button>
                    <h3 className="useraccount">User Account</h3>
                    <hr />
                    <div className="admin-detailuser-form-group">
                        <div className="admin-detailuser-form-row">
                            <label>ID:</label>
                            <input type="text" value={user._id || 'N/A'} readOnly className="admin-detailuser-input" />
                        </div>
                        <div className="admin-detailuser-form-row">
                            <label>User Name:</label>
                            <input type="text" value={user.username || 'N/A'} readOnly className="admin-detailuser-input" />
                        </div>
                        <div className="admin-detailuser-form-row">
                            <label>Email:</label>
                            <input type="text" value={user.email || 'N/A'} readOnly className="admin-detailuser-input" />
                        </div>
                        <div className="admin-detailuser-form-row">
                            <label>Phone:</label>
                            <input type="text" value={user.phone || 'N/A'} readOnly className="admin-detailuser-input" />
                        </div>
                        {/* Ẩn giá trị mật khẩu nếu không cần thiết */}
                        <div className="admin-detailuser-form-row">
                            <label>Password:</label>
                            <input
                                type="password" // Loại input password để hiển thị ký tự `*`
                                value={user.password || '********'}
                                readOnly
                                className="admin-detailuser-input"
                            />
                        </div>
                        {/* Row for creation date */}
                        <div className="admin-detailuser-form-row">
                            <label>Created At:</label>
                            <input
                                type="text"
                                value={this.formatDate(user.created_at)}
                                readOnly
                                className="admin-detailuser-input"
                            />
                        </div>

                        {/* Hiển thị địa chỉ */}
                        <div className="admin-detailuser-form-row">
                            <label>Address:</label>
                            {user.address && user.address.length > 0 ? (
                                user.address.map((addr, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={`Street: ${addr.street || ''}, City: ${addr.city || ''}, District: ${addr.district || ''}, Country: ${addr.country || ''}`}
                                        readOnly
                                        className="admin-detailuser-input"
                                    />
                                ))
                            ) : (
                                <input
                                    type="text"
                                    value="No address available"
                                    readOnly
                                    className="admin-detailuser-input"
                                />
                            )}
                        </div>

                    </div>
                    <div className="admin-detailuser-form-actions">
                        <button className="admin-detailuser-ok-button" onClick={onBackClick}>Close</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailUser;
