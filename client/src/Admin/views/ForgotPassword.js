// src/Admin/views/ForgotPassword.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Admin/styles/ForgotPassword.scss';
import Footer from '../../User/components/Footer';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/forgot-password', {
                username,
                phone,
                email
            });
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else if (error.response && error.response.status === 404) {
                alert("Không tìm thấy người dùng với thông tin này.");
            } else {
                alert("Xử lý yêu cầu quên mật khẩu không thành công, vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="forgot-container">
            <div className="forgot-header">
                <button className="forgot-back-button" onClick={() => navigate(-1)}>←</button>
                <h1 className="forgot-title">ChronoVault</h1>
            </div>

            <div className="forgot-content">
                <div className="forgot-section">
                    <h2 className="forgot-h2">FORGOT PASSWORD</h2>
                    <div className="forgot-input-field">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="forgot-input-field">
                        <label>Phone</label>
                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="forgot-input-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button className="forgot-button" onClick={handleForgotPassword}>Submit</button>
                    <a href="" className="register-login" onClick={() => navigate('/login')}>Login</a>
                </div>
            </div>
            <div className='ft'>
                <Footer />
            </div>
        </div>
    );
};

export default ForgotPassword;
