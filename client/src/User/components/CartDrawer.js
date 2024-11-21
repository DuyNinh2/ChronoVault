import React, { useEffect, useState } from 'react';
import { fetchCartItems, updateCartQuantity } from '../services/cartService';
import { getCurrentUserID } from '../services/authService';
import { Link } from 'react-router-dom';
import '../styles/CartDrawer.scss';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const userID = getCurrentUserID();

  useEffect(() => {
    if (isOpen && userID) {
      fetchCartItems(userID)
        .then((data) => setCartItems(data.cartItems))
        .catch((err) => console.error('Error fetching cart items:', err));
    }
  }, [isOpen, userID]);

  const updateQuantity = (itemID, newQuantity) => {
    if (newQuantity <= 0) return;
    updateCartQuantity(userID, itemID, newQuantity)
      .then((data) => setCartItems(data.cartItems))
      .catch((err) => console.error('Error updating quantity:', err));
  };

  return (
    <>
      {isOpen && <div className="backdrop" onClick={onClose}></div>}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="cart-content">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">${item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <p className="item-total">${item.price * item.quantity}</p>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <div className="cart-footer">
          <p className="subtotal">
            <span>Subtotal</span>
            <span>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
          </p>
          <p className="checkout-info">Taxes and shipping are calculated at checkout.</p>
          <button className="checkout-btn"><Link to='/checkout'>Checkout</Link></button>
          <button className="view-cart-btn"><Link to='/cart'>View Cart</Link></button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
