import React from 'react';
import '../styles/ProductCard.scss';

const ProductCard = ({ label, name, oldPrice, newPrice }) => (
  <div className="product-card">
    <div className="image">
      {label && <span className="label">{label}</span>}
      <div className="thumbnail"></div>
    </div>
    <p className="name">{name}</p>
    <p className="price">
      {oldPrice && <span className="old-price">${oldPrice}</span>}
      <span className="new-price">${newPrice}</span>
    </p>
  </div>
);

export default ProductCard;
