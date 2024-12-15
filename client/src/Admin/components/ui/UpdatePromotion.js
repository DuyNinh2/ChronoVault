import React, { Component } from 'react';
import axios from 'axios';
import '../../styles/UpdatePromotion.scss'; // Đảm bảo rằng SCSS được import chính xác

class UpdatePromotion extends Component {
    state = {
        promotionName: this.props.promotion.promotionName || '',
        startDate: this.props.promotion.startDate || '',
        endDate: this.props.promotion.endDate || '',
        discount: this.props.promotion.discount || '',
        watchID: this.props.promotion.watchID || [], // Ensure watchID is an array
        availableWatches: [], // List of available watches
    };

    componentDidMount() {
        // Fetch list of watches
        this.fetchWatches();
    }

    fetchWatches = async () => {
        try {
            const response = await axios.get('/api/watches');
            this.setState({ availableWatches: response.data });
        } catch (error) {
            console.error('Error fetching watches:', error);
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        let { watchID } = this.state;

        if (checked) {
            // If checked, add the watch ID to the array
            watchID = [...watchID, value];
        } else {
            // If unchecked, remove the watch ID from the array
            watchID = watchID.filter(id => id !== value);
        }

        this.setState({ watchID });
    };

    formatDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date) ? date.toISOString().split('T')[0] : '';
    };

    handleFormSubmit = async (event) => {
        event.preventDefault();
        const { promotionName, startDate, endDate, discount, watchID } = this.state;
        const { promotion, onClose } = this.props;

        try {
            await axios.put(`/api/updatepromotions/${promotion._id}`, {
                promotionName,
                startDate,
                endDate,
                discount,
                watchID,
            });
            alert('Promotion updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error updating promotion:', error);
            alert('Failed to update promotion.');
        }
    };

    render() {
        const { promotionName, startDate, endDate, discount, watchID, availableWatches } = this.state;
        const { onClose } = this.props;

        return (
            <div className="admin-updatepromotion-overlay">
                <div className="admin-updatepromotion-form">
                    <h2>Update Promotion</h2>
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="admin-updatepromotion-form-row">
                            <label>Promotion Name:</label>
                            <input
                                type="text"
                                name="promotionName"
                                value={promotionName}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>

                        <div className="admin-updatepromotion-form-row">
                            <label>Start Date:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={this.formatDate(startDate)}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>

                        <div className="admin-updatepromotion-form-row">
                            <label>End Date:</label>
                            <input
                                type="date"
                                name="endDate"
                                value={this.formatDate(endDate)}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>

                        <div className="admin-updatepromotion-form-row">
                            <label>Discount (%) :</label>
                            <input
                                type="number"
                                name="discount"
                                min="0"
                                max="100"
                                value={discount}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>

                        <div className="checkbox-group">
                            {availableWatches.map((watch) => (
                                <div key={watch._id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id={`watch-${watch._id}`}
                                        value={watch._id}
                                        checked={watchID.includes(watch._id)} // Simplified check
                                        onChange={this.handleCheckboxChange}
                                    />
                                    <label htmlFor={`watch-${watch._id}`}>{watch.name}</label>
                                </div>
                            ))}
                        </div>

                        <div className="admin-updatepromotion-form-actions">
                            <button
                                className="admin-updatepromotion-update-confirm-btn"
                                type="submit"
                            >
                                Update
                            </button>
                            <button
                                className="admin-updatepromotion-cancel-btn"
                                type="button"
                                onClick={onClose}
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


export default UpdatePromotion;
