// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import ManageSystem from '../../components/admin/ManageSystem'; // Chắc chắn là import đúng
import ProductManagement from '../../views/admin/ProductManagement';
import OrderManagement from '../../views/admin/OrderManagement'; // Nhập các component khác nếu cần
import PromotionManagement from '../../views/admin/PromotionManagement';
import UserManagement from '../../views/admin/UserManagement';
import StatisticsManagement from '../../views/admin/StatisticsManagement';
import '../../styles/admin/AdminLayout.scss';

const AdminLayout = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'product':
                return <ProductManagement />;
            case 'order':
                return <OrderManagement />;
            case 'promotion':
                return <PromotionManagement />;
            case 'user':
                return <UserManagement />;
            case 'statistics':
                return <StatisticsManagement />;
            default:
                return <h2>Please select a management option.</h2>;
        }
    };

    return (
        <div className="admin-layout">
            <Header />
            <div className="admin-content">
                <ManageSystem setActiveComponent={setActiveComponent} />
                <main className="display-content">
                    {renderComponent()} {/* Nội dung chính sẽ được hiển thị ở đây */}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminLayout;
