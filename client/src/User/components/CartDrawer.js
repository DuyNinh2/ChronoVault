import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CartDrawer.scss';

const CartDrawer = ({ isOpen, onClose, cartItems }) => (
  <>
    {isOpen && <div className="backdrop" onClick={onClose}></div>}
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      <div className="cart-content">
        {cartItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-details">
              <p className="item-name">{item.name}</p>
              <p className="item-price">${item.price}</p>
              <div className="quantity-controls">
                <button>-</button>
                <span>{item.quantity}</span>
                <button>+</button>
              </div>
            </div>
            <p className="item-total">${item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <p className="subtotal">
          <span>Subtotal</span>
          <span>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
        </p>
        <p className="checkout-info">Taxes and shipping are calculated at checkout.</p>
        <button className="checkout-btn"><Link to='/checkout'>Checkout</Link></button>
        <button className="view-cart-btn"><Link to='/cart'>View Cart</Link></button>
      </div>
    </div>
  </>
);

export default CartDrawer;
