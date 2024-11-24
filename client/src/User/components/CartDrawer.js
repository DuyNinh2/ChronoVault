import React, { useEffect, useState } from 'react';
import { fetchCartItems, updateCartQuantity, removeCartItem } from '../services/cartService';
import { getCurrentUserID } from '../services/authService';
import { Link } from 'react-router-dom';
import '../styles/CartDrawer.scss';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const userID = getCurrentUserID();

  useEffect(() => {
    if (isOpen && userID) {
      fetchCartItems(userID)
        .then((cartItems) => {
          setCartItems(cartItems); 
          // console.log(cartItems);
        })
        .catch((err) => console.error('Error fetching cart items:', err));
    }
  }, [isOpen, userID]);
  

  const updateQuantity = (itemID, currentQuantity, stockQuantity, increment) => {
    const newQuantity = currentQuantity + increment;
    // console.log(stockQuantity);
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
    <>
      {isOpen && <div className="backdrop" onClick={onClose}></div>}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="cart-content">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <img src={item.product.image} alt={item.product.name} className="item-image" />
                <div className="item-details">
                  <p className="item-name">{item.product.name}</p>
                  <p className="item-price">${item.product.price}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.watchId, item.quantity, item.product.stock_quantity, -1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.watchId, item.quantity, item.product.stock_quantity, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="item-total">${(item.product.price * item.quantity).toFixed(2)}</p>
                <button className="remove-item-btn" onClick={() => handleRemoveItem(item.watchId)}>
                  &#128465;
                </button>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <div className="cart-footer">
          <p className="subtotal">
            <span>Subtotal</span>
            <span>${cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</span>
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
