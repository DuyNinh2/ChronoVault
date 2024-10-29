import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.scss';

function Header() {
    return (
        <section className='h-wrapper'>
            <div className='h-container'>
                <h1>ChronoVault</h1>
                <div className='h-menu'>
                    <Link to='/products'>All Products</Link>
                    <Link to='/new-arrivals'>New Arrivals</Link>
                    <Link to='/brands'>Brands</Link>
                    <Link to='/about'>About</Link>
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
