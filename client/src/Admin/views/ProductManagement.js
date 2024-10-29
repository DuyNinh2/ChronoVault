import React, { Component } from 'react';
import '../../Admin/styles/ProductManagement.scss';

class ProductManagement extends Component {
    state = {
        searchTerm: '',
        products: [
            { id: 1, name: 'Watch A', price: 100, amount: 10, image: 'path/to/imageA.jpg' },
            { id: 2, name: 'Watch B', price: 200, amount: 5, image: 'path/to/imageB.jpg' },
        ],
        showAddForm: false,
        newProduct: {
            id: '',
            name: '',
            price: '',
            amount: '',
            image: null,
        },
        showConfirmModal: false,
        showNotification: false,
    };

    handleAddProduct = () => {
        this.setState({ showAddForm: true });
    };

    handleInputChange = (e) => {
        const { name, value, files } = e.target;
        this.setState(prevState => ({
            newProduct: {
                ...prevState.newProduct,
                [name]: files ? files[0] : value,
            }
        }));
    };

    handleAddConfirm = () => {
        this.setState(prevState => ({
            products: [
                ...prevState.products,
                {
                    ...prevState.newProduct,
                    id: prevState.products.length + 1
                }
            ], // Thêm ID tự động
            showAddForm: false,
            newProduct: { id: '', name: '', price: '', amount: '', image: null },
            showNotification: true,
        }));
    };

    handleAddCancel = () => {
        this.setState({ showAddForm: false, newProduct: { id: '', name: '', price: '', amount: '', image: null } });
    };

    handleShowConfirm = () => {
        this.setState({ showConfirmModal: true });
    };

    handleCloseConfirm = () => {
        this.setState({ showConfirmModal: false });
    };

    render() {
        const { searchTerm, products, showAddForm, newProduct, showConfirmModal, showNotification } = this.state;

        const filteredProducts = products.filter(product =>
            product.id.toString().includes(searchTerm) ||
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
                            placeholder="Search by ID, Name, or Price"
                            value={searchTerm}
                            onChange={(e) => this.setState({ searchTerm: e.target.value })}
                        />
                        <button className="add-button" onClick={this.handleAddProduct}>Add</button>
                    </div>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Amount</th>
                                <th>Image</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.amount}</td>
                                    <td>
                                        {product.image && <img src={product.image} alt={product.name} width="50" />}
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
                    <div className="overlay"> {/* Lớp phủ xung quanh form */}
                        <div className="add-product-form">
                            <button className="back-btn" onClick={this.handleAddCancel}>Back</button>
                            <h2>Add Product</h2>
                            <div className="form-row">
                                <label className="form-row-label">ID:</label>
                                <input className="form-row-input" type="text" name="id" value={newProduct.id} onChange={this.handleInputChange} />
                            </div>
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
                                <input className="form-row-input" type="number" name="amount" value={newProduct.amount} onChange={this.handleInputChange} />
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Image:</label>
                                <input className="form-row-input" type="file" name="image" onChange={this.handleInputChange} />
                            </div>
                            <div className="form-actions">
                                <button className="add-confirm-btn" onClick={this.handleAddConfirm}>Add</button>
                                <button className="cancel-btn" onClick={this.handleAddCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {showNotification && (
                    <div className="confirm-modal">
                        <div className="modal-content">
                            <h3>Notification</h3>
                            <p>Product added successfully!</p>
                            <button className="yes-btn" onClick={() => this.setState({ showNotification: false })}>OK</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ProductManagement;
