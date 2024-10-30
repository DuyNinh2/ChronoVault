import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/header.scss';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

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
                    <button className='login-button'>
                        <Link to='/login'>Login</Link>
                    </button>
                    <Link to='/cart'><img src={require('../images/cart_icon.png')} alt='cart' width={35} /></Link>
                </div>
            </div>
        </section>
    );
}

export default Header;
