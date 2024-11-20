import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Breadcrumb.scss';

const Breadcrumb = ({ productName }) => (
  <div className="breadcrumb">
    <Link to="/">Home</Link> &gt; <Link to="/products">All Products</Link> &gt; {productName}
  </div>
);

export default Breadcrumb;
