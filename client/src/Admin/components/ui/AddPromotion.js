// src/components/ui/AddPromotion.js
import React, { Component } from "react";
import SelectProductInAddPromotion from './SelectProductInAddPromotion'; // Import component chọn sản phẩm
import '../../styles/AddPromotion.scss';

class AddPromotion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPromotion: {
                id: '',
                name: '',
                startDate: '',
                endDate: '',
                discount: '',
            },
            showSelectProductForm: false, // State để kiểm soát việc hiển thị form chọn sản phẩm
            selectedProducts: [], // Danh sách sản phẩm đã chọn
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'discount' && isNaN(value)) {
            alert("Vui lòng nhập số cho trường Discount.");
            return;
        }

        this.setState(prevState => ({
            newPromotion: {
                ...prevState.newPromotion,
                [name]: value,
            },
        }));
    };

    handleAddConfirm = () => {
        const { newPromotion } = this.state;

        if (this.validatePromotion(newPromotion)) {
            this.setState({ showSelectProductForm: true }); // Hiện form chọn sản phẩm
        }
    };

    validatePromotion = (promotion) => {
        if (!promotion.id || !promotion.name || !promotion.startDate || !promotion.endDate || !promotion.discount) {
            alert("Vui lòng điền đầy đủ thông tin khuyến mãi.");
            return false;
        }

        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);
        if (endDate < startDate) {
            alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
            return false;
        }

        return true; // Trả về true nếu tất cả điều kiện được thỏa mãn
    };

    handleAddCancel = () => {
        this.props.onClose();
    };

    handleConfirmProductSelection = (selectedProducts) => {
        this.setState({
            selectedProducts,
            showSelectProductForm: false // Đóng form chọn sản phẩm sau khi xác nhận
        });
        alert(`Khuyến mãi đã được thêm với sản phẩm ID: ${selectedProducts.join(', ')}`); // Xác nhận thông tin
        this.props.onClose(); // Đóng form sau khi xác nhận
    };

    render() {
        const { newPromotion, showSelectProductForm, selectedProducts } = this.state;
        return (
            <div className="admin-addpromotion-overlay">
                <div className="admin-addpromotion-form">
                    <h2>Add Promotion</h2>
                    {/* Form thêm khuyến mãi */}
                    <div className="admin-addpromotion-form-row">
                        <label className="admin-addpromotion-form-row-label">ID:</label>
                        <input
                            className="admin-addpromotion-form-row-input"
                            type="text"
                            name="id"
                            value={newPromotion.id}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-addpromotion-form-row">
                        <label className="admin-addpromotion-form-row-label">Name:</label>
                        <input
                            className="admin-addpromotion-form-row-input"
                            type="text"
                            name="name"
                            value={newPromotion.name}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-addpromotion-form-row">
                        <label className="admin-addpromotion-form-row-label">Start Date:</label>
                        <input
                            className="admin-addpromotion-form-row-input"
                            type="date"
                            name="startDate"
                            value={newPromotion.startDate}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-addpromotion-form-row">
                        <label className="admin-addpromotion-form-row-label">End Date:</label>
                        <input
                            className="admin-addpromotion-form-row-input"
                            type="date"
                            name="endDate"
                            value={newPromotion.endDate}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-addpromotion-form-row">
                        <label className="admin-addpromotion-form-row-label">Discount:</label>
                        <input
                            className="admin-addpromotion-form-row-input"
                            type="text"
                            name="discount"
                            value={newPromotion.discount}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-addpromotion-form-actions">
                        <button className="admin-addpromotion-add-confirm-btn" onClick={this.handleAddConfirm}>Add</button>
                        <button className="admin-addpromotion-cancel-btn" onClick={this.handleAddCancel}>Cancel</button>
                    </div>

                    {showSelectProductForm && (
                        <SelectProductInAddPromotion
                            onClose={() => this.setState({ showSelectProductForm: false })}
                            onConfirm={this.handleConfirmProductSelection}
                        />
                    )}

                    {/* Hiển thị danh sách sản phẩm đã chọn */}
                    {selectedProducts.length > 0 && (
                        <div className="selected-products">
                            <h3>Selected Products:</h3>
                            <ul>
                                {selectedProducts.map(id => (
                                    <li key={id}>Product ID: {id}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default AddPromotion;
