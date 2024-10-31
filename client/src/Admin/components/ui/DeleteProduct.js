// src/components/ui/DeleteProduct.js
import React from 'react';

const DeleteProduct = ({ product, onDelete, onCancel }) => {
    const handleDelete = () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the product: ${product.name}?`);
        if (confirmDelete) {
            onDelete(product.id);
        }
    };

    return (
        <div className="delete-product-overlay">
            <div className="delete-product-confirmation">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete the product "{product.name}"?</p>
                <div className="delete-actions">
                    <button className="confirm-delete-btn" onClick={handleDelete}>Delete</button>
                    <button className="cancel-delete-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProduct;
