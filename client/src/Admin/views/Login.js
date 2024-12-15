import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Admin/styles/Login.scss';
import Footer from '../../User/components/Footer';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            alert('Tên đăng nhập và mật khẩu không được để trống!');
            return;
        }


        try {
            let endpoint;

            if (isAdmin) {
                endpoint = 'http://localhost:5000/api/admin/login';
            } else if (isStaff) {
                endpoint = 'http://localhost:5000/api/staff/login';
            } else {
                endpoint = 'http://localhost:5000/api/user/login';
            }

            const response = await axios.post(endpoint, { username, password });

            if (response.status === 200) {
                if (isAdmin) {
                    navigate('/admin-system');
                } else if (isStaff) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('staffId', response.data.staffId);
                    localStorage.setItem('username', response.data.username);
                    navigate('/staff-dashboard');
                } else {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('username', response.data.username);
                    navigate('/');
                }
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            alert('Sai tên đăng nhập hoặc mật khẩu!');
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleCreateAccount = () => {
        navigate('/create-account');
    };

    return (
        <div className="login-container">
            <div className="header">
                <button className="back-button" onClick={() => navigate(-1)}>←</button>
                <div className="ChronoVault-h1">
                    <Link className="ChronoVault" to='/'><h1>ChronoVault</h1></Link>
                </div>
            </div>

            <div className="login-content">
                <div className="login-section">
                    <h2 className="login-h2">LOG IN</h2>
                    <div className="input-field">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="role-checkboxes">
                        <label>
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => {
                                    setIsAdmin(e.target.checked);
                                    setIsStaff(false); // Đảm bảo chỉ chọn một checkbox
                                }}
                            />
                            Log in as Admin
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={isStaff}
                                onChange={(e) => {
                                    setIsStaff(e.target.checked);
                                    setIsAdmin(false); // Đảm bảo chỉ chọn một checkbox
                                }}
                            />
                            Log in as Staff
                        </label>
                    </div>
                    <a href="" className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</a>

                    <button className="login-button" onClick={handleLogin}>Log In</button>
                </div>

                <div className="divider"></div>

                <div className="signup-section">
                    <h2>CREATE AN ACCOUNT</h2>
                    <p>
                        Create a personal account that allows you to experience the services
                        of the web in the best possible way.
                    </p>
                    <button className="signup-button" onClick={handleCreateAccount}>Create an account</button>
                </div>
            </div>
            <div className="ft">
                <Footer />
            </div>
        </div>
    );
};

export default Login;
