import '../styles/header.scss';

function Header() {
    return(
    <section className='h-wrapper'>
        <div className='h-container'>
            <h1>ChronoVault</h1>
            <div className='h-menu'>
                <a href=''>All Products</a>
                <a href=''>New Arrivals</a>
                <a href=''>Brands</a>
                <a href=''>About</a>
            </div>
            <div className='h-actions'> 
                <button className='login-button'>
                    <a href=''>Login</a>
                </button>
                <a href=''><img src={require('../images/cart_icon.png')} alt='cart' width={35} /></a>
            </div>
        </div>
    </section>
    );
}

export default Header;