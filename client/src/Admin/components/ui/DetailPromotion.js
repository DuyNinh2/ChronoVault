import React, { Component } from "react";
import axios from 'axios';
import '../../styles/DetailPromotion.scss';

class DetailPromotion extends Component {
    state = {
        availableWatches: [], // Lưu đồng hồ giảm giá
        isLoading: true,
    };

    componentDidMount() {
        this.loadWatches();
    }

    loadWatches = () => {
        const { promotion } = this.props; // Lấy ID của promotion từ props
        if (!promotion || !promotion._id) return;

        axios
            .get(`/api/promotions/${promotion._id}`)
            .then((response) => {
                const { watches } = response.data; // Lấy danh sách watches đã có giá giảm
                this.setState({ availableWatches: watches || [], isLoading: false });
            })
            .catch((error) => {
                console.error("Error fetching watches:", error);
                this.setState({ isLoading: false });
            });
    };

    formatDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date) ? date.toLocaleDateString() : 'Unknown';
    };

    render() {
        const { promotion, onBackClick } = this.props; // Nhận thông tin promotion và hàm trở lại từ props
        const { availableWatches, isLoading } = this.state;

        if (!promotion) {
            return null; // Nếu không có promotion, không render gì
        }

        return (
            <div className="admin-detailpromotion-overlay">
                <div className="admin-detailpromotion-form">
                    <button className="admin-detailpromotion-back-button" onClick={onBackClick}>Back</button>
                    <h3 className="promotionaccount">Promotion Details</h3>
                    <hr />
                    <div className="admin-detailpromotion-form-group">
                        <div className="admin-detailpromotion-form-row">
                            <label>ID:</label>
                            <input type="text" value={promotion._id || 'N/A'} readOnly className="admin-detailpromotion-input" />
                        </div>
                        <div className="admin-detailpromotion-form-row">
                            <label>Name:</label>
                            <input type="text" value={promotion.promotionName || 'N/A'} readOnly className="admin-detailpromotion-input" />
                        </div>
                        <div className="admin-detailpromotion-form-row">
                            <label>Start Date:</label>
                            <input type="text" value={this.formatDate(promotion.startDate)} readOnly className="admin-detailpromotion-input" />
                        </div>
                        <div className="admin-detailpromotion-form-row">
                            <label>End Date:</label>
                            <input type="text" value={this.formatDate(promotion.endDate)} readOnly className="admin-detailpromotion-input" />
                        </div>
                        <div className="admin-detailpromotion-form-row">
                            <label>Discount:</label>
                            <input type="text" value={`${promotion.discount}%`} readOnly className="admin-detailpromotion-input" />
                        </div>
                        {/* Hiển thị danh sách các sản phẩm giảm giá */}
                        <div className="admin-detailpromotion-form-row">
                            <label>Discounted Watches:</label>
                            <div className="discounted-watches">
                                {isLoading ? (
                                    <span>Loading watches...</span>
                                ) : availableWatches.length > 0 ? (
                                    <ul>
                                        {availableWatches.map((watch, index) => (
                                            <li key={index}>
                                                {watch.name} - Original: {watch.price}$,
                                                Discount: {promotion.discount}% Off,
                                                Now: {watch.discountedPrice}$
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>No watches are discounted for this promotion.</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="admin-detailpromotion-form-actions">
                        <button className="admin-detailpromotion-ok-button" onClick={onBackClick}>Close</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailPromotion;
