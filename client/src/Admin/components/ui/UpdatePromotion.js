import React, { Component } from "react";
import axios from "axios";
import "../../styles/UpdatePromotion.scss";

class UpdatePromotion extends Component {
    state = {
        updatedPromotion: {
            promotionName: "",
            startDate: "",
            endDate: "",
            discount: "",
        },
        selectedWatches: [],
        availableWatches: [],
        isLoading: true,
    };

    // Called when the component is mounted to load promotion data and available watches
    componentDidMount() {
        this.loadPromotionData();
        this.loadWatches();
    }

    // Load promotion details based on the promotionId passed via props
    loadPromotionData = () => {
        const { promotionId } = this.props;
        if (promotionId) {
            axios
                .get(`/api/promotions/${promotionId}`)
                .then((response) => {
                    const promotion = response.data;
                    this.setState({
                        updatedPromotion: {
                            promotionName: promotion.promotionName || "",
                            startDate: promotion.startDate || "",
                            endDate: promotion.endDate || "",
                            discount: promotion.discount || "",
                        },
                        selectedWatches: promotion.selectedWatches || [],
                    });
                })
                .catch((error) => {
                    console.error("Error fetching promotion data:", error);
                    alert("Failed to load promotion data.");
                });
        }
    };

    // Load list of available watches
    loadWatches = () => {
        axios
            .get("/api/watches")
            .then((response) => {
                this.setState({ availableWatches: response.data, isLoading: false });
            })
            .catch((error) => {
                console.error("Error fetching watches:", error);
                this.setState({ isLoading: false });
            });
    };

    // Handle input changes for promotion details
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            updatedPromotion: {
                ...prevState.updatedPromotion,
                [name]: value,
            },
        }));
    };

    // Handle selection and deselection of watches
    handleWatchSelection = (watchId, price) => {
        const { selectedWatches } = this.state;
        const alreadySelected = selectedWatches.some((watch) => watch.id === watchId);

        if (alreadySelected) {
            this.setState({
                selectedWatches: selectedWatches.filter((watch) => watch.id !== watchId),
            });
        } else {
            this.setState({
                selectedWatches: [
                    ...selectedWatches,
                    { id: watchId, discountedPrice: price - (price * (this.state.updatedPromotion.discount / 100)) },
                ],
            });
        }
    };

    // Handle promotion update
    handleUpdatePromotion = () => {
        const { updatedPromotion, selectedWatches } = this.state;
        const { promotionId } = this.props;

        // Validate that required fields are filled
        if (!updatedPromotion.promotionName || !updatedPromotion.startDate || !updatedPromotion.endDate || !updatedPromotion.discount) {
            alert("Please fill in all the required fields.");
            return;
        }

        const promotionData = {
            ...updatedPromotion,
            selectedWatches: selectedWatches.map((watch) => watch.id),
        };

        axios
            .put(`/api/updatepromotions/${promotionId}`, promotionData)
            .then(() => {
                alert("Promotion updated successfully!");
                this.props.onClose(); // Close the form after successful update
            })
            .catch((error) => {
                console.error("Error updating promotion:", error);
                alert("Failed to update promotion. Please try again.");
            });
    };

    render() {
        const { updatedPromotion, availableWatches, selectedWatches, isLoading } = this.state;

        return (
            <div className="admin-updatepromotion-overlay">
                <div className="admin-updatepromotion-form">
                    <h2>Update Promotion</h2>
                    {/* Render promotion details allowing editing */}
                    <div className="admin-updatepromotion-form-row">
                        <label>Promotion Name:</label>
                        <input
                            type="text"
                            name="promotionName"
                            value={updatedPromotion.promotionName || ""}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-updatepromotion-form-row">
                        <label>Start Date:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={updatedPromotion.startDate || ""}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-updatepromotion-form-row">
                        <label>End Date:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={updatedPromotion.endDate || ""}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="admin-updatepromotion-form-row">
                        <label>Discount (%):</label>
                        <input
                            type="number"
                            name="discount"
                            value={updatedPromotion.discount || ""}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    {/* Watch Selection */}
                    <div className="watch-selection">
                        <h3>Select Watches:</h3>
                        {isLoading ? (
                            <p>Loading watches...</p>
                        ) : (
                            availableWatches.map((watch) => (
                                <div key={watch._id} className="watch-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedWatches.some((sel) => sel.id === watch._id)}
                                        onChange={() => this.handleWatchSelection(watch._id, watch.price)}
                                    />
                                    <label>
                                        {watch.name} - Price: ${watch.price}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="admin-updatepromotion-form-actions">
                        <button onClick={this.handleUpdatePromotion}>Update Promotion</button>
                        <button onClick={this.props.onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdatePromotion;
