import React, { Component } from 'react';
import axios from 'axios';
import '../../styles/UpdateProduct.scss';

class UpdateProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedProduct: {
                id: props.product.id,
                name: props.product.name,
                price: props.product.price,
                stock_quantity: props.product.stock_quantity,
                description: props.product.description,
                brandID: props.product.brand_id || '',
                category_id: props.product.category_id || '',
                newBrand: '',
                newCategory: '',
                images: props.product.images || [],
            },
            brands: props.brands || [],
            categories: props.categories || [],
        };
    }

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
    handleInputChange = (e) => {
        const { name, value, files } = e.target;
        this.setState(prevState => ({
            updatedProduct: {
                ...prevState.updatedProduct,
                [name]: files ? files : value,  // Dữ liệu dạng tệp sẽ được lưu vào mảng
            }
        }));
    };


    handleUpdateConfirm = async () => {
        const { updatedProduct } = this.state;

        if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.stock_quantity) {
            alert("Please fill out all required fields.");
            return;
        }

        // const confirmUpdate = window.confirm("Are you sure you want to update this product?");
        // if (!confirmUpdate) return;

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

            const response = await axios.put(`/api/updatewatch/${updatedProduct}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                alert('Product updated successfully!');
                this.fetchProducts();
                this.handleUpdateCancel();
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert(
                `Error updating product: ${error.response?.data?.message || error.message || "Unknown error"}`
            );
        }
    };


    handleCancel = () => {
        this.props.onCancel(); // Giả sử bạn có một hàm onCancel trong props để hủy thay đổi
    };

    render() {
        const { updatedProduct, brands, categories } = this.state;

        return (
            <div className="overlay">
                <div className="update-product-form">
                    <h2>Update Product</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        this.handleUpdateConfirm();
                    }}>
                        {/* Tên sản phẩm */}
                        <div className="form-group">
                            <label htmlFor="name">Product Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={updatedProduct.name}
                                onChange={this.handleInputChange}
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
                                onChange={this.handleInputChange}
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
                                onChange={this.handleInputChange}
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
                                onChange={this.handleInputChange}
                            />
                        </div>

                        {/* Brand */}
                        <div className="form-group">
                            <label htmlFor="brandID">Brand</label>
                            <select
                                name="brandID"
                                value={updatedProduct.brandID}
                                onChange={this.handleInputChange}
                            >
                                <option value="">Select an existing brand</option>
                                {brands.map((brand) => (
                                    <option key={brand._id} value={brand._id}>
                                        {brand.name}
                                    </option>
                                ))}
                                <option value="new">Add new brand</option>
                            </select>
                            {updatedProduct.brandID === 'new' && (
                                <input
                                    type="text"
                                    name="newBrand"
                                    placeholder="New Brand Name"
                                    onChange={this.handleInputChange}
                                />
                            )}
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label htmlFor="category_id">Category</label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={updatedProduct.category_id}
                                onChange={this.handleInputChange}
                            >
                                <option value="select">Select an existing category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                                <option value="new">Add new category</option>
                            </select>
                            {updatedProduct.category_id === 'new' && (
                                <input
                                    type="text"
                                    name="newCategory"
                                    placeholder="New Category Name"
                                    onChange={this.handleInputChange}
                                />
                            )}
                        </div>

                        {/* Upload hình ảnh */}
                        <div className="form-group">
                            <label htmlFor="images">Upload Images</label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                onChange={this.handleInputChange}
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
                            <button type="submit" className="btn btn-primary" onClick={this.handleUpdateConfirm}>
                                Update Product
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={this.handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default UpdateProduct;

