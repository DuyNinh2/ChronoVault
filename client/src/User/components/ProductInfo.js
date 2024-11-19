import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ProductInfo.scss';

const ProductInfo = ({ name, price, description, onAddToCart }) => (
  <div className="product-info">
    <h1>{name}</h1>
    <p className="price">${price.toFixed(2)}</p>
    <p className="description">{description}</p>
    <div className="quantity">
      <span>Quantity</span>
      <button>-</button>
      <span>1</span>
      <button>+</button>
    </div>
    <div className="buttons">
      <button className="add-to-cart" onClick={onAddToCart}>Add to Cart</button>
      <button className="buy-now">Buy Now</button>
      <button className="wishlist">&#10084;</button>
    </div>
  </div>
);

ProductInfo.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductInfo;
