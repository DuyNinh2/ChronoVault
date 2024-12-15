import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import thư viện axios để gọi API
import '../../Admin/styles/CreatAccount.scss';
import Footer from '../../User/components/Footer';

const CreatAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== rePassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        if (!username || !email || !password || !phone || !rePassword) {
            alert('Thông tin không được để trống!');
            return;
        }
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Email không đúng định dạng!");
            return;
        }

        // Kiểm tra số điện thoại (10-11 số)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert("Số điện thoại chỉ được có 10 số!");
            return;
        }

        try {
            const response = await axios.post('/api/user/create-account', {
                username,
                email,
                phone,
                password
            });

            if (response.status === 201) {
                alert('Tài khoản được tạo thành công!');
                navigate('/login');
            }
        } catch (error) { // Đảm bảo thêm `error` vào đây
            console.log("Error details:", error.response); // Thêm dòng này để kiểm tra chi tiết lỗi
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);  // Hiển thị thông báo lỗi từ backend
            } else {
                alert('Đăng ký không thành công, vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-header">
                <button className="register-back-button" onClick={() => navigate(-1)}>←</button>

                <Link className="register-title" to='/'><h1>ChronoVault</h1></Link>
            </div>

            <div className="register-content">
                <div className="register-section">
                    <h2 className='register-h2'>CREATE ACCOUNT</h2>
                    <div className="register-input-field">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="register-input-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="register-input-field">
                        <label>Phone</label>
                        <input
                            type="number"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="register-input-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="register-input-field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                        />
                    </div>
                    <button className="register-button" onClick={handleRegister}>Register</button>
                    <a href="" className="register-login" onClick={() => navigate('/login')}>Login</a>
                </div>
            </div>
            <div className='ft'>
                <Footer />
            </div>
        </div>
    );
};

export default CreatAccount;
