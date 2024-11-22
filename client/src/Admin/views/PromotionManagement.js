import React, { Component } from 'react';
import axios from "axios";
import '../../Admin/styles/PromotionManagement.scss';
import AddPromotion from '../../Admin/components/ui/AddPromotion';
import UpdatePromotion from '../../Admin/components/ui/UpdatePromotion';
import DetailPromotion from '../../Admin/components/ui/DetailPromotion'; // Import the DetailPromotion component

class PromotionManagement extends Component {
    state = {
        selectedManagement: 'promotion',
        searchTerm: '',
        promotions: [],
        showAddForm: false,
        showUpdateForm: false,
        showDetailForm: false, // New state for detail view
        selectedPromotion: null,
    };

    componentDidMount() {
        this.fetchPromotions();
    }

    fetchPromotions = async () => {
        try {
            const response = await axios.get('/api/promotions');
            this.setState({ promotions: response.data });
        } catch (error) {
            console.error("Error fetching promotions:", error);
        }
    };

    handleShowAddForm = () => {
        this.setState({ showAddForm: true });
    };

    handleCloseAddForm = () => {
        this.setState({ showAddForm: false });
        this.fetchPromotions();
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    handleUpdatePromotion = (promotion) => {
        this.setState({
            showUpdateForm: true,
            selectedPromotion: promotion
        });
    };

    handleDeletePromotion = async (_id) => {
        const confirmed = window.confirm("Are you sure you want to delete this promotion?");
        if (confirmed) {
            try {
                await axios.delete(`/api/deletepromotions/${_id}`);
                this.setState({
                    promotions: this.state.promotions.filter(promotion => promotion._id !== _id)
                });
                alert("Promotion deleted successfully!");
            } catch (error) {
                console.error("Error deleting promotion:", error);
                alert("Failed to delete promotion.");
            }
        }
    };

    handleViewPromotionDetails = (promotion) => {
        this.setState({
            showDetailForm: true,
            selectedPromotion: promotion
        });
    };

    handleBackToList = () => {
        this.setState({
            showDetailForm: false,
            selectedPromotion: null
        });
    };

    render() {
        const { searchTerm, promotions, showAddForm, showUpdateForm, showDetailForm, selectedPromotion } = this.state;

        const filteredPromotions = promotions.filter(promotion =>
            promotion.promotionName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="promotion-management">
                <div className="display-content">
                    <h2>Promotion Management</h2>
                    <div className="promotion-actions">
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                        />
                        <button className="add-button" onClick={this.handleShowAddForm}>Add</button>
                    </div>
                    <table className="promotion-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Discount</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPromotions.length > 0 ? (
                                filteredPromotions.map(promotion => (
                                    <tr key={promotion._id}>
                                        <td>{promotion._id}</td>
                                        <td>{promotion.promotionName}</td>
                                        <td>{promotion.startDate}</td>
                                        <td>{promotion.endDate}</td>
                                        <td>{promotion.discount}%</td>
                                        <td className='options'>
                                            <button className="delete-btn" onClick={() => this.handleDeletePromotion(promotion._id)}>Delete</button>
                                            <button className="update-btn" onClick={() => this.handleUpdatePromotion(promotion)}>Update</button>
                                            <button className="view-btn" onClick={() => this.handleViewPromotionDetails(promotion)}>View</button> {/* View button */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No promotions available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {showAddForm && (
                        <AddPromotion
                            onClose={this.handleCloseAddForm}
                        />
                    )}
                    {showUpdateForm && selectedPromotion && (
                        <UpdatePromotion
                            promotion={selectedPromotion}
                            onClose={() => {
                                this.setState({ showUpdateForm: false, selectedPromotion: null });
                                this.fetchPromotions();
                            }}
                        />
                    )}
                    {showDetailForm && selectedPromotion && (
                        <DetailPromotion
                            promotion={selectedPromotion}
                            onBackClick={this.handleBackToList} // Handle back button click
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default PromotionManagement;
