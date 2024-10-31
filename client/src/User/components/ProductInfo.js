import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ProductInfo.scss';

const ProductInfo = ({ onAddToCart }) => (
  <div className="product-info">
    <h1>WATCH NAME</h1>
    <p className="price">$350.00</p>
    <p className="description">
      Product description. I'm a great place to add more details about your product such as sizing, material, care instructions, and cleaning instructions.
    </p>
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
