import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap'; 
import '../styles/Header.scss';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleAboutClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            document.querySelector('.intro-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                document.querySelector('.intro-section').scrollIntoView({ behavior: 'smooth' });
            }, 100); // Delay to allow navigation before scrolling
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
                <div className='h-actions'>
                    {username ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className='username'>
                                {username}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                                <Dropdown.Item href="/orders">Orders</Dropdown.Item>
                                <Dropdown.Item href="/favorites">Favorites</Dropdown.Item>
                                <Dropdown.Item href="/settings">Account Settings</Dropdown.Item>
                                <Dropdown.Item href="/contact">Contact Us</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <button className='login-button'>
                            <Link to='/login'>Login</Link>
                        </button>
                    )}
                    <Link to='/cart'><img src={require('../images/cart_icon.png')} alt='cart' width={35} /></Link>
                </div>
            </div>
        </section>
    );
}

export default Header;
