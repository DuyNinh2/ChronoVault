// src/components/ui/DeleteProduct.js
import React from 'react';
import '../../../Admin/styles/DeleteProduct.scss';

const DeleteProduct = ({ product, onDelete, onCancel }) => {
    return (
        <div className="delete-product-overlay">
            <div className="delete-product-confirmation">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete the product "{product.name}"?</p>
                <div className="delete-actions">
                    <button className="confirm-delete-btn" onClick={() => onDelete(product.id)}>Delete</button>
                    <button className="cancel-delete-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProduct;
