import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCartItems, updateCartQuantity, removeCartItem } from '../services/cartService';
import { getCurrentUserID } from '../services/authService';
import '../styles/Cart.scss';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const userID = getCurrentUserID();

  useEffect(() => {
    if (userID) {
      fetchCartItems(userID)
        .then((cartItems) => setCartItems(cartItems))
        .catch((err) => console.error('Error fetching cart items:', err));
    }
  }, [userID]);

  const updateQuantity = (itemID, currentQuantity, stockQuantity, increment) => {
    const newQuantity = currentQuantity + increment;
    if (newQuantity < 1 || newQuantity > stockQuantity) {
      alert(newQuantity > stockQuantity ? 'Out of stock!' : 'Quantity cannot be less than 1.');
      return;
    }

    updateCartQuantity(userID, itemID, newQuantity)
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.watchId === itemID ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((err) => console.error('Error updating quantity:', err));
  };

  const handleRemoveItem = (itemID) => {
    removeCartItem(userID, itemID)
      .then(() => {
        setCartItems((prevItems) => prevItems.filter((item) => item.watchId !== itemID));
      })
      .catch((err) => console.error('Error removing item:', err));
  };

  return (
    <div className="cart-page">
      <div className="cart-items">
        <h2>My Cart</h2>
        {cartItems.map((item) => (
          <div className="cart-item" key={item._id}>
            <div className="item-image">
              <img src={item.product.image} alt={item.product.name} />
            </div>
            <div className="item-details">
              <p>{item.product.name}</p>
              <p>${item.product.price}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => updateQuantity(item.watchId, item.quantity, item.product.stock_quantity, -1)} disabled={item.quantity === 1}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.watchId, item.quantity, item.product.stock_quantity, 1)}>
                +
              </button>
            </div>
            <p className="item-total">${(item.product.price * item.quantity).toFixed(2)}</p>
            <button className="remove-item" onClick={() => handleRemoveItem(item.watchId)}>&#128465;</button>
          </div>
        ))}
      </div>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p className="total">
          <span>Total</span>
          <span>${cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</span>
        </p>
        <button className="checkout-button"><Link to='/checkout'>Checkout</Link></button>
        <p className="secure-checkout">&#128274; Secure Checkout</p>
      </div>
    </div>
  );
};

export default CartPage;
