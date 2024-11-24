import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrderList from "../components/OrderList";
import UpdateOrderStatusModal from "../components/UpdateOrderStatusModal";
import Footer from '../../User/components/Footer';
import "../../staff/styles/StaffDashboard.scss";

const StaffDashboard = () => {
    const [orders, setOrders] = useState([]); // Danh sách đơn hàng
    const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn để chỉnh sửa trạng thái
    const [userInfo, setUserInfo] = useState(null); // Thông tin người dùng

    // Gọi API để lấy danh sách đơn hàng được giao
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/staff/getAssignedOrders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setOrders(data.orders); // Lưu danh sách đơn hàng vào state
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        }
    };

    // Gọi API để cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await fetch("/api/staff/updateOrderStatus", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ orderId, status: newStatus }),
            });
            fetchOrders(); // Lấy lại danh sách đơn hàng sau khi cập nhật
            setSelectedOrder(null); // Đóng modal
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        }
    };

    // Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("token"); // Xóa token khỏi localStorage
        window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
    };

    useEffect(() => {
        fetchOrders(); // Gọi API lấy danh sách đơn hàng
        // Gọi API lấy thông tin người dùng
    }, []);

    return (
        <div>
            <Navbar userInfo={userInfo} onLogout={handleLogout} /> {/* Navbar hiển thị tên staff */}
            <div className="dashboard-container">
                <h2>Danh sách đơn hàng được giao</h2>
                {orders.length === 0 ? (
                    <p>Không có đơn hàng nào được giao.</p>
                ) : (
                    <OrderList orders={orders} setSelectedOrder={setSelectedOrder} />
                )}
                {selectedOrder && (
                    <UpdateOrderStatusModal
                        order={selectedOrder}
                        onSave={handleUpdateStatus}
                        onClose={() => setSelectedOrder(null)}
                    />
                )}
            </div>
            <div className="ft">
                <Footer />
            </div>
        </div>

    );
};

export default StaffDashboard;
