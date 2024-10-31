import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.scss';

const CartPage = () => {
  return (
    <div className="cart-page">
      <div className="cart-items">
        <h2>My Cart</h2>
        <div className="cart-item">
          <div className="item-image" />
          <div className="item-details">
            <p>Watch Name</p>
            <p>$250.00</p>
          </div>
          <div className="item-quantity">
            <button>-</button>
            <span>2</span>
            <button>+</button>
          </div>
          <p className="item-total">$500.00</p>
          <button className="remove-item">&#128465;</button>
        </div>
        <div className="cart-item">
          <div className="item-image" />
          <div className="item-details">
            <p>Watch Name</p>
            <p>$350.00</p>
          </div>
          <div className="item-quantity">
            <button>-</button>
            <span>1</span>
            <button>+</button>
          </div>
          <p className="item-total">$350.00</p>
          <button className="remove-item">&#128465;</button>
        </div>
        <div className="promo-code">
          <span>&#128176;</span> Enter a promo code
        </div>
      </div>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p className="total">
          <span>Total</span>
          <span>$850.00</span>
        </p>
        <button className="checkout-button"><Link to='/checkout'>Checkout</Link></button>
        <p className="secure-checkout">&#128274; Secure Checkout</p>
      </div>
    </div>
  );
};

export default CartPage;
