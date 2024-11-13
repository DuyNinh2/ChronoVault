import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';
import '../styles/WatchList.scss';

const WatchesList = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };

    loadProducts();
  }, []);

  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  return (
    <div className="watches-list">
      <h1>All Products</h1>
      <p>{products.length} products</p>
      <div className="products-grid">
        {products.map(product => (
          <div
            key={product.id}
            className="product-card"
            onMouseEnter={() => handleMouseEnter(product.id)}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={hoveredProduct === product.id && product.images[1] ? product.images[1].image_url : product.images[0].image_url}
              alt={product.name}
              className="product-image"
            />
            <h2>{product.name}</h2>
            <p>${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchesList;
