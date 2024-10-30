import React from 'react';
import '../styles/Footer.scss'; // Assuming your SCSS is in this file

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <div className="brand-section">
                    <h1 className="brand-title">CHRONOVAULT</h1>
                    <p className="newsletter-title">Subscribe to our newsletter</p>
                    <p>and be among the first to hear about new arrivals, events, and special offers.</p>
                </div>
                <div className="links-section">
                    <div className="column">
                        <h3>Shop</h3>
                        <a href="#">All Products</a>
                        <a href="#">New Arrivals</a>
                        <a href="#">About</a>
                        <a href="#">Gift Card</a>
                        <h3>Follow Back</h3>
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                        <a href="#">Tiktok</a>
                    </div>
                    <div className="column">
                        <h3>Company</h3>
                        <span>info@mysite.com</span>
                        <span>123-456-7890</span>
                        <p>500 Terry Francois Street San Francisco, CA 94158</p>
                        <span>It's ChronoVault</span>
                        <h3>Helpful Links</h3>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Refund Policy</a>
                        <a href="#">Shipping Policy</a>
                        <a href="#">FAQ</a>
                    </div>
                </div>
            </div>
            <hr />
            <p className="footer-note">© 2035 by CHRONOVAULT.</p>
        </footer>
    );
};

export default Footer;
