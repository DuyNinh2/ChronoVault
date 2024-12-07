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
                stock_quantity: props.product.stock_quantity,
                description: props.product.description,
                brandID: props.product.brandID || '', // Chỉnh đúng key
                category_id: props.product.category_id || '', // Chỉnh đúng key
                newBrand: '',
                newCategory: '',
                images: props.product.images || [],
            },
            brands: props.brands || [],
            categories: props.categories || [],
        };
    }

    handleInputChange = (e) => {
        const { name, value, files } = e.target;
        this.setState(prevState => ({
            updatedProduct: {
                ...prevState.updatedProduct,
                [name]: files ? files : value,
            }
        }));
    };

    handleUpdateConfirm = () => {
        this.props.onUpdate(this.state.updatedProduct);
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
                        {/* <div className="form-group">
                            <label htmlFor="brandID">Brand</label>
                            <select
                                id="brandID"
                                name="brandID"
                                value={updatedProduct.brandID}
                                onChange={this.handleInputChange}
                            >
                                <option value="select">Select an existing brand</option>
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
                        </div> */}

                        {/* Category */}
                        {/* <div className="form-group">
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
                        </div> */}

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
                            <button type="submit" className="btn btn-primary">
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

