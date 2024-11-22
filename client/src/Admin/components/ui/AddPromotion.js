import React, { Component } from "react";
import axios from "axios";
import '../../styles/AddPromotion.scss';

class AddPromotion extends Component {
    state = {
        newPromotion: {
            promotionName: '',
            startDate: '',
            endDate: '',
            discount: '',
        },
        selectedWatches: [],
        availableWatches: [],
    };

    componentDidMount() {
        // Lấy danh sách watches từ API
        axios.get('/api/watches')
            .then(response => {
                this.setState({ availableWatches: response.data });
            })
            .catch(error => {
                console.error("Error fetching watches:", error);
            });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            newPromotion: {
                ...prevState.newPromotion,
                [name]: value,
            },
        }));
    };

    handleWatchSelection = (watchId, price) => {
        const { selectedWatches } = this.state;
        const discount = this.state.newPromotion.discount || 0;
        const discountedPrice = price - (price * (discount / 100));

        if (selectedWatches.some(watch => watch.id === watchId)) {
            this.setState({
                selectedWatches: selectedWatches.filter(watch => watch.id !== watchId),
            });
        } else {
            this.setState({
                selectedWatches: [...selectedWatches, { id: watchId, discountedPrice }],
            });
        }
    };

    handleAddPromotion = () => {
        const { newPromotion, selectedWatches } = this.state;

        const promotionData = {
            ...newPromotion,
            selectedWatches: selectedWatches.map(watch => watch.id),
        };

        console.log("Adding promotion with data:", promotionData);  // Log the data being sent

        axios.post('/api/addpromotions', promotionData)
            .then(response => {
                console.log("Promotion added successfully:", response.data);
                this.props.onClose(); // Close the form
            })
            .catch(error => {
                console.error("Error adding promotion:", error);
                alert("Failed to add promotion. Please try again.");
            });
    };


    render() {
        const { newPromotion, availableWatches, selectedWatches } = this.state;

        return (
            <div className="admin-addpromotion-overlay">
                <div className="admin-addpromotion-form">
                    <h2>Add Promotion</h2>
                    <div className="admin-addpromotion-form-row">
                        <label>Promotion Name:</label>
                        <input
                            type="text"
                            name="promotionName"
                            value={newPromotion.promotionName}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-addpromotion-form-row">
                        <label>Start Date:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={newPromotion.startDate}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-addpromotion-form-row">
                        <label>End Date:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={newPromotion.endDate}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-addpromotion-form-row">
                        <label>Discount (%):</label>
                        <input
                            type="number"
                            name="discount"
                            value={newPromotion.discount}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="watch-selection">
                        <h3>Select Watches:</h3>
                        {availableWatches.map(watch => (
                            <div key={watch._id} className="watch-item">
                                <input
                                    type="checkbox"
                                    onChange={() => this.handleWatchSelection(watch._id, watch.price)}
                                />
                                <label>{watch.name} - Price: ${watch.price}</label>
                            </div>
                        ))}
                    </div>

                    <div className="selected-watches">
                        <h3>Selected Watches:</h3>
                        {selectedWatches.map(watch => (
                            <div key={watch.id}>
                                <span>{watch.id} - Discounted Price: ${watch.discountedPrice.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="admin-addpromotion-form-actions">
                        <button className="admin-addpromotion-add-confirm-btn" onClick={this.handleAddPromotion}>Add Promotion</button>
                        <button className="admin-addpromotion-cancel-btn" onClick={this.props.onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddPromotion;
