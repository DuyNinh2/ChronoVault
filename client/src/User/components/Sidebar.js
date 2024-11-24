import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactSlider from 'react-slider';
import '../styles/Sidebar.scss';
import { fetchBrands } from '../services/brandService';

const Sidebar = () => {
  const [priceRange, setPriceRange] = useState([100, 350]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isMinInput, setIsMinInput] = useState(false);
  const [isMaxInput, setIsMaxInput] = useState(false);

  useEffect(() => {
    // Fetch brands using the service
    fetchBrands()
      .then(data => setBrands(data))
      .catch(error => console.error("Error fetching brands:", error));
  }, []);
  

  const toggleSection = (section) => {
    if (section === 'price') setIsPriceOpen(!isPriceOpen);
    if (section === 'brand') setIsBrandOpen(!isBrandOpen);
  };

  return (
    <div className="sidebar">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt; <span>All Products</span>
      </nav>

      {/* Browse By Section */}
      <div className="browse-by">
        <h3>BROWSE BY</h3>
        <ul>
          <li><Link to="/products">All Products</Link></li>
          <li><Link to="/new-arrivals">New Arrivals</Link></li>
          <li><Link to="/best-sellers">Best Sellers</Link></li>
        </ul>
      </div>

      {/* Filter By Section */}
      <div className="filter-by">
        <h3>Filter by</h3>

        {/* Price Filter */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('price')}>
            <span>Price</span>
            <span>{isPriceOpen ? '-' : '+'}</span>
          </div>
          {isPriceOpen && (
            <div className="price-filter">
              <ReactSlider
                className="range-slider"
                thumbClassName="range-slider-thumb"
                trackClassName="range-slider-track"
                value={priceRange}
                min={0}
                max={1000}
                step={10}
                onChange={(newRange) => setPriceRange(newRange)}
              />
              <div className="price-values">
                <span onClick={() => setIsMinInput(true)} className="price-text">
                  {isMinInput ? (
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      onBlur={() => setIsMinInput(false)}
                      min="0"
                      max="1000"
                    />
                  ) : (
                    `$ ${priceRange[0].toFixed(2)}`
                  )}
                </span>
                <span onClick={() => setIsMaxInput(true)} className="price-text">
                  {isMaxInput ? (
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      onBlur={() => setIsMaxInput(false)}
                      min="0"
                      max="1000"
                    />
                  ) : (
                    `$ ${priceRange[1].toFixed(2)}`
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Brand Filter */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('brand')}>
            <span>Brand</span>
            <span>{isBrandOpen ? '-' : '+'}</span>
          </div>
          {isBrandOpen && (
            <div className="brand-filter">
              {brands.map((brand) => (
                <div key={brand._id}>
                  <input
                    type="checkbox"
                    value={brand.name}
                    checked={selectedBrands.includes(brand.name)}
                    onChange={(e) => {
                      const newSelected = e.target.checked
                        ? [...selectedBrands, brand.name]
                        : selectedBrands.filter((b) => b !== brand.name);
                      setSelectedBrands(newSelected);
                    }}
                  />
                  <label>{brand.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
