import React, { Component } from 'react';
import axios from 'axios';
import '../../Admin/styles/ProductManagement.scss';

class ProductManagement extends Component {
    state = {
        searchTerm: '',
        products: [],
        brands: [],
        categories: [],
        showAddForm: false,
        newProduct: {
            name: '',
            price: '',
            stock_quantity: '',
            images: [],
            brand: '',
            category: '',
            description: ''
        },
        newBrand: '',
        newCategory: ''
    };

    componentDidMount() {
        this.fetchProducts();
        this.fetchBrands();
        this.fetchCategories();
    }

    fetchProducts = async () => {
        try {
            const response = await axios.get('/api/watches');
            this.setState({ products: response.data });
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("Error fetching products: " + error.response?.data?.message || "Unknown error");
        }
    };

    fetchBrands = async () => {
        try {
            const response = await axios.get('/api/brands');
            this.setState({ brands: response.data });
        } catch (error) {
            console.error("Error fetching brands:", error);
            alert("Error fetching brands: " + error.response?.data?.message || "Unknown error");
        }
    };

    fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            this.setState({ categories: response.data });
        } catch (error) {
            console.error("Error fetching categories:", error);
            alert("Error fetching categories: " + error.response?.data?.message || "Unknown error");
        }
    };

    handleAddProduct = () => {
        this.setState({ showAddForm: true });
    };

    handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            // Giới hạn chỉ chọn tối đa 3 hình ảnh
            const newImages = Array.from(files).slice(0, 3);
            this.setState(prevState => ({
                newProduct: {
                    ...prevState.newProduct,
                    images: newImages,
                }
            }));
        } else {
            this.setState(prevState => ({
                newProduct: {
                    ...prevState.newProduct,
                    [name]: value,
                },
                newBrand: name === 'brand' && value === 'new' ? '' : prevState.newBrand,
                newCategory: name === 'category' && value === 'new' ? '' : prevState.newCategory,
            }));
        }
    };

    handleAddConfirm = async () => {
        const { newProduct, newBrand, newCategory } = this.state;

        if (!newProduct.name || !newProduct.price || !newProduct.stock_quantity) {
            alert("Please fill out all required fields.");
            return;
        }

        const confirmAdd = window.confirm("Are you sure you want to add this product?");
        if (!confirmAdd) return;

        try {
            const formData = new FormData();

            // Append thông tin sản phẩm
            Object.keys(newProduct).forEach(key => {
                if (key === 'images' && newProduct[key].length > 0) {
                    newProduct[key].forEach(image => formData.append('images', image));
                } else {
                    formData.append(key, newProduct[key]);
                }
            });

            // Append brand/category mới nếu cần
            if (newProduct.brand === 'new' && newBrand) formData.append('newBrand', newBrand);
            if (newProduct.category === 'new' && newCategory) formData.append('newCategory', newCategory);

            const response = await axios.post('/api/addproduct', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 201) {
                alert('Product added successfully!');
                this.fetchProducts();
                this.handleAddCancel();
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert(error.response?.data?.message || "Unexpected error occurred");
        }
    };

    handleAddCancel = () => {
        this.setState({
            showAddForm: false,
            newProduct: { name: '', price: '', stock_quantity: '', images: [], brand: '', category: '', description: '' },
            newBrand: '',
            newCategory: ''
        });
    };

    render() {
        const { searchTerm, products, brands, categories, showAddForm, newProduct, newBrand, newCategory } = this.state;

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price.toString().includes(searchTerm)
        );

        return (
            <div className="product-management">
                <div className="display-content">
                    <h2>Product Management</h2>
                    <div className="product-actions">
                        <input
                            type="text"
                            placeholder="Search by name or price"
                            value={searchTerm}
                            onChange={(e) => this.setState({ searchTerm: e.target.value })}
                        />
                        <button className="add-button" onClick={this.handleAddProduct}>Add Product</button>
                    </div>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Amount</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Image</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stock_quantity}</td>
                                    <td>{product.brandID?.name}</td>
                                    <td>{product.category_id?.name}</td>
                                    <td>
                                        {product.images && product.images.map((image, index) => (
                                            <img key={index} src={image.image_url} alt={image.alt_text || 'Product image'} width="24" />
                                        ))}
                                    </td>
                                    <td className="options">
                                        <button className="update-btn">Update</button>
                                        <button className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showAddForm && (
                    <div className="overlay">
                        <div className="add-product-form">
                            <button className="back-btn" onClick={this.handleAddCancel}>Back</button>
                            <h2>Add Product</h2>
                            <div className="form-row">
                                <label className="form-row-label">Name:</label>
                                <input className="form-row-input" type="text" name="name" value={newProduct.name} onChange={this.handleInputChange} />
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Price:</label>
                                <input className="form-row-input" type="number" name="price" value={newProduct.price} onChange={this.handleInputChange} />
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Amount:</label>
                                <input className="form-row-input" type="number" name="stock_quantity" value={newProduct.stock_quantity} onChange={this.handleInputChange} />
                            </div>

                            <div className="form-row">
                                <label className="form-row-label">Description:</label>
                                <input
                                    className="form-row-input"
                                    name="description"
                                    value={newProduct.description}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Brand:</label>
                                <select className="form-row-input" name="brand" value={newProduct.brand} onChange={this.handleInputChange}>
                                    <option value="">Select Brand</option>
                                    {brands.map(brand => (
                                        <option key={brand._id} value={brand.name}>{brand.name}</option>
                                    ))}
                                    <option value="new">Add New Brand</option>
                                </select>
                                {newProduct.brand === 'new' && (
                                    <input className='addnew'
                                        type="text"
                                        placeholder="Enter new brand"
                                        value={newBrand}
                                        onChange={(e) => this.setState({ newBrand: e.target.value })}
                                    />
                                )}
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Category:</label>
                                <select className="form-row-input" name="category" value={newProduct.category} onChange={this.handleInputChange}>
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category.name}>{category.name}</option>
                                    ))}
                                    <option value="new">Add New Category</option>
                                </select>
                                {newProduct.category === 'new' && (
                                    <input className='addnew'
                                        type="text"
                                        placeholder="Enter new category"
                                        value={newCategory}
                                        onChange={(e) => this.setState({ newCategory: e.target.value })}
                                    />
                                )}
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Images:</label>
                                <input className="form-row-input" type="file" multiple accept="image/*" onChange={this.handleInputChange} />
                            </div>
                            <div className="form-actions">
                                <button className="add-confirm-btn" onClick={this.handleAddConfirm}>Add</button>
                                <button className="cancel-btn" onClick={this.handleAddCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ProductManagement;
