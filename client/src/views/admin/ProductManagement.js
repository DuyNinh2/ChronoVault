import React, { Component } from 'react';
import '../../styles/admin/ProductManagement.scss';

class ProductManagement extends Component {
    state = {
        searchTerm: '',
        products: [
            { id: 1, name: 'Watch A', price: 100, amount: 10, image: 'path/to/imageA.jpg' },
            { id: 2, name: 'Watch B', price: 200, amount: 5, image: 'path/to/imageB.jpg' },
            // Thêm sản phẩm khác nếu cần
        ],
    };

    handleAddProduct = () => {
        // Logic để thêm sản phẩm mới
        console.log("Add product functionality");
    };

    handleUpdateProduct = (id) => {
        // Logic để cập nhật sản phẩm
        console.log(`Update product with ID: ${id}`);
    };

    handleDeleteProduct = (id) => {
        // Logic để xóa sản phẩm
        console.log(`Delete product with ID: ${id}`);
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        const { searchTerm, products } = this.state;

        // Lọc sản phẩm theo ID, tên và giá
        const filteredProducts = products.filter(product =>
            product.id.toString().includes(searchTerm) || // Tìm theo ID
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Tìm theo tên
            product.price.toString().includes(searchTerm) // Tìm theo giá
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
                            onChange={this.handleSearchChange}
                        />
                        <button className="add-button" onClick={this.handleAddProduct}>Add</button>
                    </div>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Watch Name</th>
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
                                    <td>${product.price}</td>
                                    <td>{product.amount}</td>
                                    <td><img src={product.image} alt={product.name} width="50" /></td>
                                    <td className="options">
                                        <button className="update-btn" onClick={() => this.handleUpdateProduct(product.id)}>Update</button>
                                        <button className="delete-btn" onClick={() => this.handleDeleteProduct(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ProductManagement;
