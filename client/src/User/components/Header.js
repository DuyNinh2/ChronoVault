import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Dropdown } from 'react-bootstrap'; 
import '../styles/Header.scss';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => setShowMenu((prev) => !prev);
    const closeMenu = () => setShowMenu(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        const handleClickOutside = (event) => { 
            if (!event.target.closest('.dropdown-menu') && !event.target.closest('.username')) { 
                closeMenu(); 
            } 
        }; 
        const handleScroll = () => { 
            closeMenu(); 
        };

        document.addEventListener('mousedown', handleClickOutside); 
        window.addEventListener('scroll', handleScroll, true); 
        return () => { 
            document.removeEventListener('mousedown', handleClickOutside); 
            window.removeEventListener('scroll', handleScroll, true); 
        };
    }, []);


    const handleAboutClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            document.querySelector('.intro-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                document.querySelector('.intro-section').scrollIntoView({ behavior: 'smooth' });
            }, 100); 
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUsername('');
        navigate('/');
    };

    return (
        <section className='h-wrapper'>
            <div className='h-container'>
                <Link to='/'><h1>ChronoVault</h1></Link>
                <div className='h-menu'>
                    <Link to='/products'>All Products</Link>
                    <Link to='/new-arrivals'>New Arrivals</Link>
                    <Link to='/brands'>Brands</Link>
                    <Link to='/about' onClick={handleAboutClick}>About</Link>
                </div>
                <div className="h-actions">
                  {username ? (
                    <div>
                      <button
                        className="username"
                        onClick={toggleMenu}
                        aria-expanded={showMenu}
                      >
                        {username}
                      </button>
                      <div className={`dropdown-menu ${showMenu ? "show" : ""}`}>
                        {/* Menu Header */}
                        <div className="menu-header">
                          <span>Account</span>
                          <button className="close-btn" onClick={closeMenu}>
                            &times;
                          </button>
                        </div>
                
                        {/* Menu Items */}
                        <a href="/profile" className="dropdown-item">
                          Profile
                        </a>
                        <a href="/orders" className="dropdown-item">
                          Orders
                        </a>
                        <a href="/favorites" className="dropdown-item">
                          Favorites
                        </a>
                        <a href="/settings" className="dropdown-item">
                          Account Settings
                        </a>
                        <a href="/contact" className="dropdown-item">
                          Contact Us
                        </a>
                        <a onClick={handleLogout} className="dropdown-item">
                          Log Out <img src={require("../images/logout_icon.png")} alt='logout' width={20}/>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <button className="login-button">
                      <a href="/login">Login</a>
                    </button>
                  )}
                  <a href="/cart">
                    <img src={require("../images/cart_icon.png")} alt="cart" width={35} />
                  </a>
                </div>
            </div>
        </section>
    );
}

export default Header;
