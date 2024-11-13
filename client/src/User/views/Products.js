import { Link } from 'react-router-dom';
import WatchList from '../components/WatchList'; 
import '../styles/Products.scss';

function AllProducts() {
  return (
    <div className="Products">
      <aside className="sidebar">
        <div className="breadcrumb">
          <p>Home &gt; All Products</p>
        </div>
        
        <div className="browse-section">
          <h3>Browse By</h3>
          <hr />
          <ul>
            <li>All Products</li>
            <li>New Arrivals</li>
            <li>Best Sellers</li>
          </ul>
        </div>
        
        <div className="filter-section">
          <h3>Filter by</h3>
          <hr />
          
          <div className="filter-item">
            <p>Price</p>
            <input type="range" min="100" max="350" step="1" />
            <div className="price-range">
              <span>$100.00</span>
              <span>$350.00</span>
            </div>
          </div>
          
          <div className="filter-item">
            <p>Brand</p>
            <ul>
              <li><input type="checkbox" /> Rolex</li>
              <li><input type="checkbox" /> Mido</li>
              <li><input type="checkbox" /> Omega</li>
              <li><input type="checkbox" /> Hublot</li>
              <li><input type="checkbox" /> Cartier</li>
            </ul>
          </div>
        </div>
      </aside>
      
      <main className="product-list">
        <WatchList/>
      </main>
    </div>
  );
}

export default AllProducts;