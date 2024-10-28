import React, { Component } from 'react';
import '../../styles/admin/Login.scss';

class Login extends Component {
    render() {
        return (
            <div className="login-container">
                <div className="header">
                    <button className="back-button">←</button>
                    <h1 class="title">ChronoVault</h1>
                </div>

                <div className="login-content">
                    <div className="login-section">
                        <h2 className='login-h2'>LOG IN</h2>
                        <div className="input-field">
                            <label>Username</label>
                            <input type="text" placeholder="Username" />
                        </div>
                        <div className="input-field">
                            <label>Password</label>
                            <input type="password" placeholder="Password" />
                        </div>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                        <button className="login-button">Log In</button>
                    </div>

                    <div className="divider"></div>

                    <div className="signup-section">
                        <h2>CREATE AN ACCOUNT</h2>
                        <p>
                            Create a personal account that allows you to experience the services
                            of the web in the best possible way.
                        </p>
                        <button className="signup-button">Create an account</button>
                    </div>
                </div>

                <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-left">
                            <h3>CHRONOVAULT</h3>
                            <p>
                                Subscribe to our newsletter and be among the first to hear about
                                new arrivals, events and special offers.
                            </p>
                        </div>
                        <div className="footer-links">
                            <div className="column">
                                <h4>SHOP</h4>
                                <ul>
                                    <li>All Products</li>
                                    <li>New Arrivals</li>
                                    <li>About</li>
                                    <li>Gift Card</li>
                                </ul>
                            </div>
                            <div className="column">
                                <h4>COMPANY</h4>
                                <ul>
                                    <li>Email: info@site.com</li>
                                    <li>Phone: 123-456-7890</li>
                                    <li>Address: 500 Terry Francois Street, San Francisco, CA 94158</li>
                                </ul>
                            </div>
                            <div className="column">
                                <h4>FOLLOW BACK</h4>
                                <ul>
                                    <li>Facebook</li>
                                    <li>Instagram</li>
                                    <li>TikTok</li>
                                    <li>Zalo</li>
                                </ul>
                            </div>
                            <div className="column">
                                <h4>HELPFUL LINKS</h4>
                                <ul>
                                    <li>Privacy Policy</li>
                                    <li>Refund Policy</li>
                                    <li>Shipping Policy</li>
                                    <li>Terms & Conditions</li>
                                    <li>FAQ</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2035 by CHRONOVAULT.</p>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Login;
