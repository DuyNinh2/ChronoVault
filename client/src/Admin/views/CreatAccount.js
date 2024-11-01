import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Admin/styles/CreatAccount.scss';
import Footer from '../../User/components/Footer';

const CreatAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        // Logic cho quá trình đăng ký tại đây
        alert('Account created successfully!');
        navigate('/login'); // Điều hướng về trang đăng nhập sau khi đăng ký
    };

    return (
        <div className="register-container">
            <div className="register-header">
                <button className="register-back-button" onClick={() => navigate(-1)}>←</button>
                <h1 className="register-title">ChronoVault</h1>
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
                            type="text"
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
