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
            amount: '',
            image: null,
            brand: '',
            category: ''
        },
    };

    componentDidMount() {
        this.fetchProducts();
        this.fetchBrands();
        this.fetchCategories();
    }

    fetchProducts = async () => {
        const response = await axios.get('/api/watches');
        this.setState({ products: response.data });
    };

    fetchBrands = async () => {
        const response = await axios.get('/api/brands');
        this.setState({ brands: response.data });
    };

    fetchCategories = async () => {
        const response = await axios.get('/api/categories');
        this.setState({ categories: response.data });
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

    handleAddConfirm = async () => {
        const confirmAdd = window.confirm("Bạn có chắc muốn thêm sản phẩm này?");
        if (confirmAdd) {
            try {
                const formData = new FormData();
                Object.entries(this.state.newProduct).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                await axios.post('/api/product-management', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });


                this.fetchProducts();
                this.setState({
                    showAddForm: false,
                    newProduct: { name: '', price: '', amount: '', image: null, brand: '', category: '' }
                });
                alert('Thêm sản phẩm thành công!');
            } catch (error) {
                alert('Không thể thêm sản phẩm');
            }
        }
    };

    handleAddCancel = () => {
        this.setState({ showAddForm: false, newProduct: { name: '', price: '', amount: '', image: null, brand: '', category: '' } });
    };

    render() {
        const { searchTerm, products, brands, categories, showAddForm, newProduct } = this.state;

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price.toString().includes(searchTerm)
        );

        return (
            <div className="product-management">
                <div className="display-content">
                    <h2>Quản Lý Sản Phẩm</h2>
                    <div className="product-actions">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc giá"
                            value={searchTerm}
                            onChange={(e) => this.setState({ searchTerm: e.target.value })}
                        />
                        <button className="add-button" onClick={this.handleAddProduct}>Thêm</button>
                    </div>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Số Lượng</th>
                                <th>Thương Hiệu</th>
                                <th>Danh Mục</th>
                                <th>Hình Ảnh</th>
                                <th>Tùy Chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.amount}</td>
                                    <td>{product.brandID?.name}</td> {/* Chỉ hiển thị tên thương hiệu */}
                                    <td>{product.categoryID?.name}</td> {/* Chỉ hiển thị tên danh mục */}
                                    <td>
                                        {product.image && <img src={product.image} alt={product.name} width="50" />}
                                    </td>
                                    <td className="options">
                                        <button className="update-btn">Cập Nhật</button>
                                        <button className="delete-btn">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showAddForm && (
                    <div className="overlay">
                        <div className="add-product-form">
                            <button className="back-btn" onClick={this.handleAddCancel}>Trở Lại</button>
                            <h2>Thêm Sản Phẩm</h2>
                            <div className="form-row">
                                <label className="form-row-label">Tên:</label>
                                <input className="form-row-input" type="text" name="name" value={newProduct.name} onChange={this.handleInputChange} />
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Giá:</label>
                                <input className="form-row-input" type="number" name="price" value={newProduct.price} onChange={this.handleInputChange} />
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Số Lượng:</label>
                                <input className="form-row-input" type="number" name="amount" value={newProduct.amount} onChange={this.handleInputChange} />
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Thương Hiệu:</label>
                                <select className="form-row-input" name="brand" value={newProduct.brand} onChange={this.handleInputChange}>
                                    <option value="">Chọn Thương Hiệu</option>
                                    {brands.map(brand => (
                                        <option key={brand._id} value={brand.name}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Danh Mục:</label>
                                <select className="form-row-input" name="category" value={newProduct.category} onChange={this.handleInputChange}>
                                    <option value="">Chọn Danh Mục</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <label className="form-row-label">Hình Ảnh:</label>
                                <input className="form-row-input" type="file" name="image" onChange={this.handleInputChange} />
                            </div>
                            <div className="form-actions">
                                <button className="add-confirm-btn" onClick={this.handleAddConfirm}>Thêm</button>
                                <button className="cancel-btn" onClick={this.handleAddCancel}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ProductManagement;
