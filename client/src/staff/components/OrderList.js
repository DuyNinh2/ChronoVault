import React from "react";
import '../../staff/styles/OrderList.scss';

const OrderList = ({ orders, setSelectedOrder }) => {
    return (
        <table className="order-list">
            <thead>
                <tr>
                    <th>Mã đơn hàng</th>
                    <th>Tên khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Tên sản phẩm - Số lượng</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                    <th>Ngày đặt hàng</th>
                    <th>Địa chỉ</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.userID ? order.userID.username : 'Không có tên'}</td> {/* Tên khách hàng */}
                        <td>{order.userID ? order.userID.phone : 'Không có SDT'}</td>
                        <td>
                            {order.items.map((item, index) => (
                                <div key={item.watchID._id}>
                                    <p>{item.watchID.name} - Số lượng: {item.quantity}</p> {/* Tên và giá của sản phẩm */}
                                </div>
                            ))}
                        </td>
                        <td>{order.status}</td>
                        <td>{order.total_amount} $</td>
                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                        <td>{order.userID ? order.userID.address : 'Không có địa chỉ'}</td>
                        <td>
                            <button
                                onClick={() => setSelectedOrder(order)} // Gọi hàm setSelectedOrder để chọn đơn hàng
                                className="btn-update-status">
                                Cập nhật trạng thái
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OrderList;
