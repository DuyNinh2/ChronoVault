import React, { Component } from "react";
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
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;

        // Kiểm tra nếu trường là 'discount' và giá trị không phải là số
        if (name === 'discount' && isNaN(value)) {
            alert("Vui lòng nhập số cho trường Discount."); // Hiện thông báo alert
            return; // Ngừng xử lý nếu giá trị không hợp lệ
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

        // Kiểm tra dữ liệu trước khi thêm
        if (this.validatePromotion(newPromotion)) {
            this.props.onAddPromotion(newPromotion); // Gọi hàm thêm khuyến mãi từ props
            this.props.onClose(); // Đóng form sau khi thêm
        }
    };

    validatePromotion = (promotion) => {
        // Kiểm tra xem tất cả các trường có được điền hay không
        if (!promotion.id || !promotion.name || !promotion.startDate || !promotion.endDate || !promotion.discount) {
            alert("Vui lòng điền đầy đủ thông tin khuyến mãi.");
            return false;
        }

        // Kiểm tra ngày kết thúc không được nhỏ hơn ngày bắt đầu
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);
        if (endDate < startDate) {
            alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu."); // Hiện thông báo alert
            return false;
        }

        return true;
    };

    handleAddCancel = () => {
        this.props.onClose(); // Đóng form khi nhấn Cancel
    };

    handleBack = () => {
        this.props.onClose(); // Đóng form và trở về
    };

    render() {
        const { newPromotion } = this.state; // Lấy newPromotion từ state
        return (
            <div>
                <div className="admin-addpromotion-overlay">
                    <div className="admin-addpromotion-form">
                        <button className="admin-addpromotion-back" onClick={this.handleBack}>Back</button>
                        <h2>Add Promotion</h2>
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
                    </div>
                </div>
            </div>
        );
    }
}

export default AddPromotion;
