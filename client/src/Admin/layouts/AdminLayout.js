// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import Header from '../../Admin/components/Header';
import Footer from '../../User/components/Footer';
import ManageSystem from '../../Admin/components/ManageSystem';
import ProductManagement from '../../Admin/views/ProductManagement';
import OrderManagement from '../../Admin/views/OrderManagement';
import PromotionManagement from '../../Admin/views/PromotionManagement';
import UserManagement from '../../Admin/views/UserManagement';
import StatisticsManagement from '../../Admin/views/StatisticsManagement';
import '../../Admin/styles/AdminLayout.scss';

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
