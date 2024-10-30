import React from 'react';
import ProductCard from './ProductCard';
import '../styles/RelatedProducts.scss';

const RelatedProducts = () => {
  const products = [
    { label: 'NEW', name: 'Watch Name', newPrice: 250 },
    { label: 'SALE', name: 'Watch Name', oldPrice: 200, newPrice: 190 },
    { name: 'Watch Name', newPrice: 300 },
  ];

  return (
    <div className="related-products">
      <h2>You Might Also Like</h2>
      <div className="carousel">
        <button className="arrow left">&#9664;</button>
        <div className="product-list">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        <button className="arrow right">&#9654;</button>
      </div>
    </div>
  );
};

export default RelatedProducts;
