import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Admin/styles/Login.scss';
import Footer from '../../User/components/Footer';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === 'admin' && password === '1') {
            navigate('/admin-system'); // Điều hướng về AdminLayout
        } else {
            alert('Sai tên đăng nhập hoặc mật khẩu!');
        }
    };
    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Điều hướng đến trang quên mật khẩu
    };

    const handleCreateAccount = () => {
        navigate('/create-account'); // Điều hướng đến trang tạo tài khoản
    };

    return (
        <div className="login-container">
            <div className="header">
                <button className="back-button" onClick={() => navigate(-1)}>←</button>
                <h1 className="title">ChronoVault</h1>
            </div>

            <div className="login-content">
                <div className="login-section">
                    <h2 className='login-h2'>LOG IN</h2>
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
            <div className='ft'>
                <Footer />
            </div>
        </div>
    );
};

export default Login;
