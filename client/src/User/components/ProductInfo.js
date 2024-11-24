import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addToCart } from '../services/cartService';
import { getCurrentUserID } from '../services/authService';
import '../styles/ProductInfo.scss';

const ProductInfo = ({ name, price, description, watchID, openCartDrawer }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const userID = getCurrentUserID();
    if (!userID) {
      alert('You need to log in to add items to the cart.');
      window.location.href = '/login';
      return;
    }
  
    try {
      await addToCart(userID, watchID, quantity); 
      openCartDrawer();
      // alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data || error.message);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  return (
    <div className="product-info">
      <h1>{name}</h1>
      <p className="price">${price.toFixed(2)}</p>
      <p className="description">{description}</p>
      <div className="quantity">
        <span>Quantity</span>
        <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
      </div>
      <div className="buttons">
        <button className="add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button className="buy-now">Buy Now</button>
        <button className="wishlist">&#10084;</button>
      </div>
    </div>
  );
};

ProductInfo.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  watchID: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductInfo;
