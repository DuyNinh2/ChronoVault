import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import Accordion from '../components/Accordion';
import RelatedProducts from '../components/RelatedProducts';
import CartDrawer from '../components/CartDrawer';
import '../styles/ProductDetail.scss';

const ProductDetail = () => {
  const { state } = useLocation();
  const { product } = state || {};
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="product-detail">
      <Breadcrumb />
      <div className="product-detail-container">
        <div className='img'> 
          <ProductImage />
        </div> 
        <div className='detail'>
          <ProductInfo onAddToCart={handleAddToCart}/>
          <Accordion title="Product Info">
          {"Hello Hà"}
          </Accordion>
          <Accordion title="Return & Refund Policy">
          {"LOL"}
          </Accordion>
        </div>
      </div>
      <RelatedProducts />
      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} cartItems={[{ name: 'WatchName', price: 350, quantity: 1, image: '../images/mechanical.jpg' },]} />
    </div>
  );
};

export default ProductDetail;
