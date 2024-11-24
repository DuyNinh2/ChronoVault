import React, { useState } from "react";
import '../../staff/styles/UpdateOrderStatusModal.scss';

const UpdateOrderStatusModal = ({ order, onClose, onSave }) => {
    const [newStatus, setNewStatus] = useState(order.status);

    const handleSave = () => {
        onSave(order._id, newStatus); // Gọi hàm cập nhật trạng thái
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Cập nhật trạng thái đơn hàng</h3>
                <p>Mã đơn hàng: {order._id}</p>
                <p>Tên khách hàng: {order.userID ? order.userID.username : 'Không có tên'}</p> {/* Tên khách hàng */}
                <div>
                    <label>Trạng thái mới:</label>
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <button onClick={handleSave} className="btn-save">
                    Lưu
                </button>
                <button onClick={onClose} className="btn-cancel">
                    Hủy
                </button>
            </div>
        </div>
    );
};

export default UpdateOrderStatusModal;
