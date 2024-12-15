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
        showUpdateForm: false,
        productToUpdate: null,
        showHidden: false,
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
        newCategory: '',
        currentPage: 1,
        productsPerPage: 6
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
            // Lọc sản phẩm theo trạng thái 'isDeleted'
            const filteredProducts = this.state.showHidden
                ? response.data
                : response.data.filter(product => !product.isDeleted);
            this.setState({ products: filteredProducts });
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
            // Convert FileList to Array for easier manipulation
            const selectedFiles = Array.from(files);

            // Ensure no duplicate files (compare by file name or content)
            const uniqueFiles = selectedFiles.filter(file =>
                !this.state.newProduct.images.some(img => img.name === file.name)
            );

            if (uniqueFiles.length === 0) {
                alert('All selected files are duplicates of existing ones.');
                return;
            }

            // Limit to 3 unique files
            const newImages = [...this.state.newProduct.images, ...uniqueFiles].slice(0, 3);

            if (newImages.length > 3) {
                alert('You can only select up to 3 unique images.');
            }

            this.setState((prevState) => ({
                newProduct: {
                    ...prevState.newProduct,
                    images: newImages,
                },
            }));
        } else {
            this.setState((prevState) => ({
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
            console.error("Error adding product:", error.response?.data || error.message);
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

    handleUpdateProduct = (product) => {
        this.setState({
            showUpdateForm: true,
            updatedProduct: { ...product }
        });
    };

    handleUpdateConfirm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', this.state.updatedProduct.name);
        formData.append('price', this.state.updatedProduct.price);
        formData.append('stock_quantity', this.state.updatedProduct.stock_quantity);
        formData.append('description', this.state.updatedProduct.description);
        formData.append('brandID', this.state.updatedProduct.brandID);
        formData.append('category_id', this.state.updatedProduct.category_id);
        // Thêm các hình ảnh vào formData nếu có
        this.state.updatedProduct.images.forEach((image) => {
            formData.append('images', image.file);
        });

        // Gửi PUT request tới backend
        try {
            const response = await axios.put(`/api/updatewatch/${this.state.updatedProduct._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('Product updated successfully');
                this.setState({ showUpdateForm: false });
                this.fetchProducts();
            }
        } catch (error) {
            alert('Please select both Brand and Category.');
        }
    };

    handleBrandChange = (e) => {
        this.setState({
            updatedProduct: {
                ...this.state.updatedProduct,
                brandID: e.target.value
            }
        });
    };

    handleCategoryChange = (e) => {
        this.setState({
            updatedProduct: {
                ...this.state.updatedProduct,
                category_id: e.target.value
            }
        });
    };

    handleInputChangeUpdate = (e) => {
        const { name, value, files } = e.target;

        // Nếu trường là hình ảnh
        if (name === "images") {
            const newImages = Array.from(files).map(file => ({
                file: file,
                image_url: URL.createObjectURL(file),
                alt_text: file.name
            }));

            this.setState(prevState => ({
                updatedProduct: {
                    ...prevState.updatedProduct,
                    images: [...prevState.updatedProduct.images, ...newImages]
                }
            }));
        } else {
            this.setState(prevState => ({
                updatedProduct: {
                    ...prevState.updatedProduct,
                    [name]: value
                }
            }));
        }
    };

    handleUpdateCancel = () => {
        this.setState({ showUpdateForm: false });
    };

    handleDeleteProduct = async (productId, isDeleted) => {
        try {
            // Chọn đúng URL tùy theo trạng thái isDeleted
            const url = isDeleted ? `/api/restoreproduct/${productId}` : `/api/hideproduct/${productId}`;
            const response = await axios.put(url); // Sử dụng PUT để cập nhật trạng thái
            if (response.status === 200) {
                alert(isDeleted ? 'Sản phẩm đã được phục hồi' : 'Sản phẩm đã được ẩn');
                // Sau khi phục hồi/ẩn, cập nhật lại danh sách sản phẩm
                this.fetchProducts();
            }
        } catch (error) {
            console.error("Lỗi khi xử lý sản phẩm:", error);
            alert("Không thể thực hiện hành động này");
        }
    };

    toggleShowHidden = () => {
        this.setState(prevState => {
            const newShowHidden = !prevState.showHidden;
            this.fetchProducts();  // Cập nhật lại sản phẩm khi chuyển chế độ hiển thị
            return { showHidden: newShowHidden };
        });
    };


    render() {
        const { searchTerm, products, brands, categories, showAddForm, newProduct, newBrand, newCategory, showUpdateForm, currentPage, productsPerPage, updatedProduct, showHidden } = this.state;

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price.toString().includes(searchTerm)
        );

        // Calculate the products to display based on the current page
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

        // Calculate total number of pages
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
                        <button className="show-button" onClick={this.toggleShowHidden}>
                            {showHidden ? 'Hide Hidden Products' : 'Show Hidden Products'}
                        </button>
                    </div>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Image</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map(product => (
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
                                        <button className="update-btn" onClick={() => this.handleUpdateProduct(product)}>
                                            Update
                                        </button>
                                        <td>
                                            <button onClick={() => this.handleDeleteProduct(product._id, product.isDeleted)}>
                                                {product.isDeleted ? 'Restore' : 'Hide'}
                                            </button>
                                        </td>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button
                        onClick={() => this.setState({ currentPage: currentPage - 1 })}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => this.setState({ currentPage: currentPage + 1 })}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
                {showUpdateForm && updatedProduct && (
                    <div className="overlay">
                        <div className="update-product-form">
                            <h2>Update Product</h2>
                            <form onSubmit={this.handleUpdateConfirm}>
                                {/* Tên sản phẩm */}
                                <div className="form-group">
                                    <label htmlFor="name">Product Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={updatedProduct.name}
                                        onChange={this.handleInputChangeUpdate}
                                        required
                                    />
                                </div>

                                {/* Giá */}
                                <div className="form-group">
                                    <label htmlFor="price">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={updatedProduct.price}
                                        onChange={this.handleInputChangeUpdate}
                                        required
                                    />
                                </div>

                                {/* Số lượng tồn kho */}
                                <div className="form-group">
                                    <label htmlFor="stock_quantity">Stock Quantity</label>
                                    <input
                                        type="number"
                                        id="stock_quantity"
                                        name="stock_quantity"
                                        value={updatedProduct.stock_quantity}
                                        onChange={this.handleInputChangeUpdate}
                                        required
                                    />
                                </div>

                                {/* Mô tả */}
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={updatedProduct.description}
                                        onChange={this.handleInputChangeUpdate}
                                    />
                                </div>
                                {/* Brand */}
                                <div className="form-group">
                                    <label htmlFor="brandID">Brand</label>
                                    <select
                                        id="brandID"
                                        name="brandID"
                                        value={updatedProduct.brandID || ''}
                                        onChange={this.handleInputChangeUpdate}
                                    >
                                        <option value="">Select an existing brand</option>
                                        {brands.map((brand) => (
                                            <option key={brand._id} value={brand._id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category */}
                                <div className="form-group">
                                    <label htmlFor="category_id">Category</label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={updatedProduct.category_id || ''}
                                        onChange={this.handleInputChangeUpdate}
                                    >
                                        <option value="">Select an existing category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                {/* Upload hình ảnh */}
                                <div className="form-group">
                                    <label htmlFor="images">Upload Images</label>
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        multiple
                                        onChange={this.handleInputChangeUpdate}
                                    />
                                    <div className="preview-images">
                                        {updatedProduct.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img.image_url}
                                                alt={img.alt_text}
                                                style={{ width: '50px', height: '50px', margin: '5px' }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Nút xác nhận và hủy */}
                                <div className="form-buttons">
                                    <button type="submit" className="btn btn-primary">
                                        Update Product
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={this.handleUpdateCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
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
                                <label className="form-row-label">Quantity:</label>
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
                                <input
                                    className="form-row-input"
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={this.handleInputChange}
                                />
                                {newProduct.images.length > 0 && (
                                    <div className="images-preview">
                                        {newProduct.images.map((image, index) => (
                                            <img key={index} src={URL.createObjectURL(image)} alt="preview" width="50" />
                                        ))}
                                    </div>
                                )}
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
