import React, { Component } from 'react';
import '../../styles/admin/PromotionManagement.scss';

class PromotionManagement extends Component {
    state = {
        searchTerm: '',
        promotions: [
            { id: 1, name: 'Promotion A', startDate: '2024-01-01', endDate: '2024-01-31', discount: '10%' },
            { id: 2, name: 'Promotion B', startDate: '2024-02-01', endDate: '2024-02-28', discount: '20%' },
            // Thêm các khuyến mãi khác nếu cần
        ],
    };

    handleAddPromotion = () => {
        // Logic để thêm khuyến mãi mới
        console.log("Add promotion functionality");
    };

    handleUpdatePromotion = (id) => {
        // Logic để cập nhật khuyến mãi
        console.log(`Update promotion with ID: ${id}`);
    };

    handleDeletePromotion = (id) => {
        // Logic để xóa khuyến mãi
        console.log(`Delete promotion with ID: ${id}`);
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        const { searchTerm, promotions } = this.state;

        // Lọc khuyến mãi theo ID và tên
        const filteredPromotions = promotions.filter(promotion =>
            promotion.id.toString().includes(searchTerm) || // Tìm theo ID
            promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) // Tìm theo tên
        );

        return (
            <div className="promotion-management">
                <div className="display-content">
                    <h2>Promotion Management</h2>
                    <div className="promotion-actions">
                        <input
                            type="text"
                            placeholder="Search by ID or Name"
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                        />
                        <button className="add-button" onClick={this.handleAddPromotion}>Add</button>
                    </div>
                    <table className="promotion-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Promotion Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Discount</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPromotions.map(promotion => (
                                <tr key={promotion.id}>
                                    <td>{promotion.id}</td>
                                    <td>{promotion.name}</td>
                                    <td>{promotion.startDate}</td>
                                    <td>{promotion.endDate}</td>
                                    <td>{promotion.discount}</td>
                                    <td className="options">
                                        <button className="update-btn" onClick={() => this.handleUpdatePromotion(promotion.id)}>Update</button>
                                        <button className="delete-btn" onClick={() => this.handleDeletePromotion(promotion.id)}>Delete</button>
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

export default PromotionManagement;
