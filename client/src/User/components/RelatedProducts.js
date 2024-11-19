import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { fetchRelatedProducts } from '../services/productService';
import '../styles/RelatedProducts.scss';

const RelatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState('');
  const productListRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchRelatedProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load related products:', error);
      }
    };

    loadProducts();
  }, []);

  const handleNext = () => {
    setTransitionDirection('left');
    setVisibleIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrevious = () => {
    setTransitionDirection('right');
    setVisibleIndex((prevIndex) =>
      (prevIndex - 1 + products.length) % products.length
    );
  };

  const visibleProducts = [
    products[visibleIndex % products.length],
    products[(visibleIndex + 1) % products.length],
    products[(visibleIndex + 2) % products.length],
  ];

  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.style.transition = 'transform 0.5s ease-in-out';
      if (transitionDirection === 'left') {
        productListRef.current.style.transform = `translateX(-100%)`;
      } else if (transitionDirection === 'right') {
        productListRef.current.style.transform = `translateX(100%)`;
      }
      setTimeout(() => {
        productListRef.current.style.transition = 'none';
        productListRef.current.style.transform = 'translateX(0)';
        setTransitionDirection('');
      }, 500);
    }
  }, [visibleIndex, transitionDirection]);

  return (
    <div className="related-products">
      <h2>You Might Also Like</h2>
      <div className="carousel-wrapper">
        <div className="carousel">
          <button
            className={`arrow left ${products.length <= 3 ? 'disabled' : ''}`}
            onClick={handlePrevious}
          >
            &#9664;
          </button>
          <div className="product-list" ref={productListRef}>
            {visibleProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          <button
            className={`arrow right ${products.length <= 3 ? 'disabled' : ''}`}
            onClick={handleNext}
          >
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
