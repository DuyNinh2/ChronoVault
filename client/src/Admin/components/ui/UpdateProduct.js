import React, { Component } from 'react';
import '../../styles/UpdateProduct.scss';

class UpdateProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedProduct: {
                id: props.product.id,
                name: props.product.name,
                price: props.product.price,
                amount: props.product.amount,
                image: props.product.image,
                brand: props.product.brand || '', // thêm brand
                category: props.product.category || '', // thêm category
                newBrand: '', // input cho brand mới
                newCategory: '', // input cho category mới
            },
            brands: props.brands || [], // danh sách các thương hiệu
            categories: props.categories || [], // danh sách các danh mục
        };
    }

    handleInputChange = (e) => {
        const { name, value, files } = e.target;
        this.setState(prevState => ({
            updatedProduct: {
                ...prevState.updatedProduct,
                [name]: files ? files[0] : value,
            }
        }));
    };

    handleSelectChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            updatedProduct: {
                ...prevState.updatedProduct,
                [name]: value,
            }
        }));
    };

    handleAddNewBrand = () => {
        const { newBrand } = this.state.updatedProduct;
        if (newBrand) {
            this.setState(prevState => ({
                brands: [...prevState.brands, newBrand],
                updatedProduct: {
                    ...prevState.updatedProduct,
                    brand: newBrand,
                    newBrand: '',
                }
            }));
        }
    };

    handleAddNewCategory = () => {
        const { newCategory } = this.state.updatedProduct;
        if (newCategory) {
            this.setState(prevState => ({
                categories: [...prevState.categories, newCategory],
                updatedProduct: {
                    ...prevState.updatedProduct,
                    category: newCategory,
                    newCategory: '',
                }
            }));
        }
    };

    handleUpdateConfirm = () => {
        const confirmUpdate = window.confirm("Are you sure you want to update this product?");
        if (confirmUpdate) {
            this.props.onUpdate(this.state.updatedProduct);
            alert('Product updated successfully!');
            this.props.onClose(); // Đóng form cập nhật
        }
    };

    handleUpdateCancel = () => {
        this.props.onClose(); // Đóng form mà không cập nhật
    };

    render() {
        const { updatedProduct, brands, categories } = this.state;

        return (
            <div className="overlay">
                <div className="update-product-form">
                    <button className="back-btn" onClick={this.handleUpdateCancel}>Back</button>
                    <h2>Update Product</h2>
                    <div className="form-row">
                        <label className="form-row-label">ID:</label>
                        <input
                            className="form-row-input"
                            type="text"
                            name="id"
                            value={updatedProduct.id}
                            readOnly
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-row-label">Name:</label>
                        <input
                            className="form-row-input"
                            type="text"
                            name="name"
                            value={updatedProduct.name}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-row-label">Price:</label>
                        <input
                            className="form-row-input"
                            type="number"
                            name="price"
                            value={updatedProduct.price}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-row-label">Amount:</label>
                        <input
                            className="form-row-input"
                            type="number"
                            name="amount"
                            value={updatedProduct.amount}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-row-label">Brand:</label>
                        <select
                            className="form-row-input"
                            name="brand"
                            value={updatedProduct.brand}
                            onChange={this.handleSelectChange}
                        >
                            <option value="">Select a brand</option>
                            {brands.map((brand, index) => (
                                <option key={index} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <input
                            className="form-row-input"
                            type="text"
                            name="newBrand"
                            placeholder="Add new brand"
                            value={updatedProduct.newBrand}
                            onChange={this.handleInputChange}
                        />
                        <button type="button" onClick={this.handleAddNewBrand}>Add Brand</button>
                    </div>
                    <div className="form-row">
                        <label className="form-row-label">Category:</label>
                        <select
                            className="form-row-input"
                            name="category"
                            value={updatedProduct.category}
                            onChange={this.handleSelectChange}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <input
                            className="form-row-input"
                            type="text"
                            name="newCategory"
                            placeholder="Add new category"
                            value={updatedProduct.newCategory}
                            onChange={this.handleInputChange}
                        />
                        <button type="button" onClick={this.handleAddNewCategory}>Add Category</button>
                    </div>
                    <div className="form-row">
                        <label className="form-row-label">Image:</label>
                        <input
                            className="form-row-input"
                            type="file"
                            name="image"
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="form-actions">
                        <button className="update-confirm-btn" onClick={this.handleUpdateConfirm}>Update</button>
                        <button className="cancel-btn" onClick={this.handleUpdateCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdateProduct;
