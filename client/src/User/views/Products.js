import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactSlider from 'react-slider';
import '../styles/Products.scss';
import { fetchBrands } from '../services/brandService';
import { fetchProducts } from '../services/productService';

const AllProducts = () => {
  const location = useLocation();
  console.log(location.state?.filter);
  const [filter, setFilter] = useState(location.state?.filter || 'all-products');
  // console.log(filter);
  const [priceRange, setPriceRange] = useState([100, 4500]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isMinInput, setIsMinInput] = useState(false);
  const [isMaxInput, setIsMaxInput] = useState(false);
  const [products, setProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const navigate = useNavigate();

  const fetchFilteredProducts = async () => {
    const filters = {
      // filter: filter !== 'all-products' ? filter : undefined,
      ...(filter && { filter }),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      brand: selectedBrands.join(','),
      limit: productsPerPage,
    };

    console.log("Filters being sent:", filters);

    try {
      const data = await fetchProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  useEffect(() => {
    fetchBrands()
      .then(data => setBrands(data))
      .catch(error => console.error("Error fetching brands:", error));
    // console.log("Filter updated:", filter);
    fetchFilteredProducts();
  }, [filter, priceRange, selectedBrands]);

  const toggleSection = (section) => {
    if (section === 'price') setIsPriceOpen(!isPriceOpen);
    if (section === 'brand') setIsBrandOpen(!isBrandOpen);
  };

  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
  };

  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getHeading = () => {
    switch (filter) {
      case 'new-arrivals':
        return 'New Arrivals';
      case 'best-sellers':
        return 'Best Sellers';
      default:
        return 'All Products';
    }
  };

  return (
    <div className="all-products-container">
      <div className="sidebar">
        {/* Breadcrumb Navigation */}
        <nav className="address">
          <Link to="/">Home</Link> &gt; <span>All Products</span>
        </nav>

        {/* Browse By Section */}
        <div className="browse-by">
          <h3>BROWSE BY</h3>
          <ul>
            <li onClick={() => setFilter('all-products')}>All Products</li>
            <li onClick={() => setFilter('new-arrivals')}>New Arrivals</li>
            <li onClick={() => setFilter('best-sellers')}>Best Sellers</li>
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
                  max={5000}
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
                        max="5000"
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
                        max="5000"
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
                        const updatedBrands = e.target.checked
                          ? [...selectedBrands, brand.name]
                          : selectedBrands.filter((b) => b !== brand.name);
                        setSelectedBrands(updatedBrands);
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

      <div className="watches-list">
        <h1>{getHeading()}</h1>
        <p>{products.length} products</p>
        <div className="products-grid">
          {products.map(product => (
            <div
              key={product._id}
              className="product-card"
              onMouseEnter={() => handleMouseEnter(product._id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleProductClick(product)}
            >
              <img
                src={hoveredProduct === product._id && product.images[1] ? product.images[1].image_url : product.images[0].image_url}
                alt={product.name}
                className="product-image"
              />
              <h2>{product.name}</h2>
              <p>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
