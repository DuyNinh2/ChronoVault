// src/components/Footer.jsx
import React from 'react';
import '../../Admin/styles//common.scss';

const Footer = () => {
    return (
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
    );
};

export default Footer;
