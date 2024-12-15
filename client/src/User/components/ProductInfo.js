import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addToCart } from '../services/cartService';
import { getCurrentUserID } from '../services/authService';
import { toggleWishlist } from '../services/productService';
import { fetchWishlist } from '../services/userService';
import '../styles/ProductInfo.scss';

const ProductInfo = ({ name, price, originalPrice, description, watchID, openCartDrawer }) => {
  const [quantity, setQuantity] = useState(1);
  const displayPrice = Number(price) || 0; 
  const displayOriginalPrice = Number(originalPrice) || null;
  const [isWishlistAdded, setIsWishlistAdded] = useState(false);

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

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const userID = getCurrentUserID();
      if (!userID) return; // Người dùng chưa đăng nhập

      try {
        const wishlist = await fetchWishlist(userID);
        // Kiểm tra sản phẩm hiện tại có trong wishlist không
        setIsWishlistAdded(wishlist.some((item) => item._id === watchID));
      } catch (error) {
        console.error('Error fetching wishlist:', error.message);
      }
    };

    fetchWishlistStatus();
  }, [watchID]);

  const handleWishlistToggle = async () => {
    const userID = getCurrentUserID();
    if (!userID) {
      alert('You need to log in to manage your wishlist.');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await toggleWishlist(userID, watchID);
      setIsWishlistAdded(response.message === 'Added to wishlist');
    } catch (error) {
      console.error('Error toggling wishlist:', error.response?.data || error.message);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  return (
    <div className="product-info">
      <h1>{name}</h1>
      <div className="product-pricing">
        {displayOriginalPrice && (
          <span className="original-price">${displayOriginalPrice.toFixed(2)}</span>
        )}
        <span className="current-price">${displayPrice.toFixed(2)}</span>
      </div>
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
        {/* <button className="buy-now">Buy Now</button> */}
        <button
          className={`wishlist ${isWishlistAdded ? 'active' : ''}`}
          onClick={handleWishlistToggle}
        >
          {isWishlistAdded ? '❤️' : '♡'}
        </button>
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
