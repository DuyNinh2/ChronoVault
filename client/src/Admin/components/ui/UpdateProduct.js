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
            },
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
        const { updatedProduct } = this.state;

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
