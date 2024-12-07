import React, { Component } from 'react';
import axios from 'axios';
import '../../Admin/styles/ProductManagement.scss';
import UpdateProduct from '../../Admin/components/ui/UpdateProduct';

class ProductManagement extends Component {
    state = {
        searchTerm: '',
        products: [],
        brands: [],
        categories: [],
        showAddForm: false,
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
            productToUpdate: product,
            updatedProduct: { ...product }  // Đặt giá trị ban đầu của sản phẩm vào form cập nhật
        });
    };

    // Phương thức để cập nhật thông tin sản phẩm
    handleUpdateConfirm = async () => {
        const { updatedProduct } = this.state;

        if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.stock_quantity) {
            alert("Please fill out all required fields.");
            return;
        }

        const confirmUpdate = window.confirm("Are you sure you want to update this product?");
        if (!confirmUpdate) return;

        try {
            const formData = new FormData();

            // Append các trường cập nhật
            Object.keys(updatedProduct).forEach(key => {
                if (key === 'images' && updatedProduct[key]?.length > 0) {
                    updatedProduct[key].forEach(image => formData.append('images', image));
                } else {
                    formData.append(key, updatedProduct[key]);
                }
            });

            const response = await axios.put(`/api/updatewatch/${updatedProduct._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                alert('Product updated successfully!');
                this.fetchProducts();
                this.handleUpdateCancel();
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product: " + (error.response?.data?.message || error.message || "Unknown error"));
        }
    };

    // Phương thức hủy bỏ form cập nhật
    handleUpdateCancel = () => {
        this.setState({
            showUpdateForm: false,
            productToUpdate: null,
            updatedProduct: { name: '', price: '', stock_quantity: '', images: [], brandID: '', category_id: '', description: '' }
        });
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
        const { searchTerm, products, brands, categories, showAddForm, newProduct, newBrand, newCategory, showUpdateForm, updatedProduct, currentPage, productsPerPage, productToUpdate, showHidden } = this.state;

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
                    <UpdateProduct
                        product={updatedProduct}
                        onDelete={this.handleUpdateProduct}
                        onCancel={() => this.setState({ showUpdateForm: false, productToUpdate: null })}
                    />
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
