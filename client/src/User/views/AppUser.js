import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from '../../User/components/Header';
import Home from './home';
import Login from '../../Admin/views/Login';
import AdminLayout from '../../Admin/layouts/AdminLayout';
import ProductManagement from '../../Admin/views/ProductManagement';
import PromotionManagement from '../../Admin/views/PromotionManagement';
import UserManagement from '../../Admin/views/UserManagement';
import OrderManagement from '../../Admin/views/OrderManagement';
import StatisticsManagement from '../../Admin/views/StatisticsManagement';

const AppUser = () => {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

    // Kiểm tra xem đường dẫn hiện tại có phải là Home không
    const isHomePage = location.pathname === "/";

    return (
        <>
            {isHomePage && <Header />} {/* Chỉ hiển thị Header khi ở trang Home */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-system" element={<AdminLayout />} />
                <Route path="/product-management" element={<ProductManagement />} />
                <Route path="/order-management" element={<OrderManagement />} />
                <Route path="/promotion-management" element={<PromotionManagement />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/statistics-management" element={<StatisticsManagement />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppUser />
        </Router>
    );
};

export default App;
