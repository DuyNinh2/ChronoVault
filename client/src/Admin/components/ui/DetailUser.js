import React, { Component } from "react";
import '../../styles/DetailUser.scss';

class DetailUser extends Component {
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
                            <input type="text" value={user.id} readOnly className="admin-detailuser-input" />
                        </div>
                        <div className="admin-detailuser-form-row">
                            <label>User Name:</label>
                            <input type="text" value={user.username} readOnly className="admin-detailuser-input" />
                        </div>
                        <div className="admin-detailuser-form-row">
                            <label>Email:</label>
                            <input type="text" value={user.email} readOnly className="admin-detailuser-input" />
                        </div>
                        <div className="admin-detailuser-form-row">
                            <label>Phone:</label>
                            <input type="text" value={user.phone} readOnly className="admin-detailuser-input" />
                        </div>
                        <div className="admin-detailuser-form-row">
                            <label>Password:</label>
                            <input type="text" value={user.password} readOnly className="admin-detailuser-input" />
                        </div>
                    </div>
                    <div className="admin-detailuser-form-actions">
                        <button className="admin-detailuser-ok-button" onClick={onBackClick}>OK</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailUser;
