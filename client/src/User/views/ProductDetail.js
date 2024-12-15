import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import Accordion from '../components/Accordion';
import RelatedProducts from '../components/RelatedProducts';
import CartDrawer from '../components/CartDrawer';
import { fetchDiscountedProducts } from '../services/productService';
import '../styles/ProductDetail.scss';

const ProductDetail = () => {
  const { state } = useLocation();
  const { product } = state || {};
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const [newCartItem, setNewCartItem] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  const handleAddToCart = (item) => {
    // setNewCartItem(item);
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  useEffect(() => {
    const fetchDiscount = async () => {
      if (product) {
        try {
          const discountedProducts = await fetchDiscountedProducts();
          const matchingProduct = discountedProducts.find(dp => dp._id === product._id);
          if (matchingProduct) {
            setDiscountedPrice(matchingProduct.discountedPrice);
          }
        } catch (error) {
          console.error('Error fetching discounted product details:', error);
        }
      }
    };

    fetchDiscount();
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail">
      <Breadcrumb productName={product.name} />
      <div className="product-detail-container">
        <div className='img'> 
          <ProductImage images={product.images} />
        </div> 
        <div className='detail'>
          <ProductInfo 
            name={product.name}
            price={discountedPrice || product.price} 
            originalPrice={discountedPrice ? product.price : null}
            description={product.description}
            watchID={product._id}
            openCartDrawer={handleAddToCart}
          />
          <Accordion title="Product Info">
            {product.description || "No additional product information available."}
          </Accordion>
          <Accordion title="Return & Refund Policy">
            {product.returnPolicy || "No return policy provided."}
          </Accordion>
        </div>
      </div>
      <RelatedProducts />
      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />
    </div>
  );
};

export default ProductDetail;
