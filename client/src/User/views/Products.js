import React from 'react';
import { Link } from 'react-router-dom';
import WatchList from '../components/WatchList';
import Sidebar from '../components/Sidebar'; 
import '../styles/Products.scss';

function AllProducts() {
  return (
    <div className="all-products-container"> 
      <Sidebar /> 
      <div className="watches-list">
        <WatchList /> 
      </div>
    </div>
  );
}

export default AllProducts;
