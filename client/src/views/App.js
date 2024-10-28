import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './admin/Login';
import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import ProductManagement from './admin/ProductManagement';
import PromotionManagement from './admin/PromotionManagement';
import UserManagement from './admin/UserManagement';
import OrderManagement from './admin/OrderManagement';
import StatisticsManagement from './admin/StatisticsManagement'; // Nhập OrderManagement


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AdminLayout />} />
                <Route path="/product-management" element={<ProductManagement />} />
                <Route path="/order-management" element={<OrderManagement />} />
                <Route path="/promotion-management" element={<PromotionManagement />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/statistics-management" element={<StatisticsManagement />} />
            </Routes>
        </Router>
    );
};

export default App;
