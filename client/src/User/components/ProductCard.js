import React from 'react';
import '../styles/ProductCard.scss';

const ProductCard = ({ name, price, images }) => {
  const mainImage = images && images[0]?.image_url;
  return (
    <div className="p-card">
      <div className="p-image">
        <img 
          src={mainImage || 'placeholder.png'} 
          alt={images && images[0]?.alt_text || 'Product'} 
        />
      </div>
      <div className="p-info">
        <p className="p-name">{name || 'Unnamed Product'}</p>
        <p className="p-price">${price ? price.toFixed(2) : 'N/A'}</p>
      </div>
    </div>
  );
};

export default ProductCard;
