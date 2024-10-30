import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import Accordion from '../components/Accordion';
import RelatedProducts from '../components/RelatedProducts';
import '../styles/ProductDetail.scss';

const ProductDetail = () => (
  <div className="product-detail">
    <Breadcrumb />
    <div className="product-detail-container">
      <div className='img'> 
        <ProductImage />
      </div> 
      <div className='detail'>
        <ProductInfo />
        <Accordion title="Product Info">
        {"Hello Hà"}
        </Accordion>
        <Accordion title="Return & Refund Policy">
        {"LOL"}
        </Accordion>
      </div>
    </div>
    <RelatedProducts />
  </div>
);

export default ProductDetail;
