// src/components/ui/SelectProductInAddPromotion.js
import React, { Component } from 'react';
import '../../styles/SelectProductInAddPromotion.scss'; // Thêm CSS cho component này

class SelectProductInAddPromotion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [
                { id: 1, name: 'Watch A', price: 100, amount: 10, image: 'path/to/imageA.jpg' },
                { id: 2, name: 'Watch B', price: 200, amount: 5, image: 'path/to/imageB.jpg' },
                // Thêm sản phẩm khác nếu cần
            ],
            selectedProducts: [], // Danh sách sản phẩm đã chọn
        };
    }

    handleCheckboxChange = (productId) => {
        this.setState(prevState => {
            const { selectedProducts } = prevState;
            if (selectedProducts.includes(productId)) {
                return { selectedProducts: selectedProducts.filter(id => id !== productId) }; // Bỏ chọn sản phẩm
            } else {
                return { selectedProducts: [...selectedProducts, productId] }; // Thêm sản phẩm vào danh sách chọn
            }
        });
    };

    handleConfirmSelection = () => {
        const { selectedProducts } = this.state;
        if (selectedProducts.length > 0) {
            alert(`Selected Products: ${selectedProducts.join(', ')}`); // Hiện thông báo xác nhận sản phẩm đã chọn
            this.props.onConfirm(selectedProducts); // Gọi hàm xác nhận từ props
        } else {
            alert("Vui lòng chọn ít nhất một sản phẩm."); // Thông báo nếu không chọn sản phẩm nào
        }
    };

    render() {
        const { products } = this.state;
        return (
            <div className="select-product-overlay">
                <div className="select-product-form">
                    <h2>Select Products for Promotion</h2>
                    <div className="product-list">
                        {products.map(product => (
                            <div key={product.id} className="product-item">
                                <input
                                    type="checkbox"
                                    id={`product-${product.id}`}
                                    onChange={() => this.handleCheckboxChange(product.id)}
                                />
                                <label htmlFor={`product-${product.id}`}>
                                    {product.name} - ${product.price} ({product.amount} available)
                                </label>
                            </div>
                        ))}
                    </div>
                    <button className="confirm-selection-btn" onClick={this.handleConfirmSelection}>Confirm</button>
                    <button className="cancel-selection-btn" onClick={this.props.onClose}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default SelectProductInAddPromotion;
