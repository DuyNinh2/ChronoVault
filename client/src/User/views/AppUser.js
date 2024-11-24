import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from './home';
import Products from './Products';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import CheckOut from './CheckOut';
import Login from '../../Admin/views/Login';
import CreatAccount from '../../Admin/views/CreatAccount';
import AdminLayout from '../../Admin/layouts/AdminLayout';
import ProductManagement from '../../Admin/views/ProductManagement';
import PromotionManagement from '../../Admin/views/PromotionManagement';
import UserManagement from '../../Admin/views/UserManagement';
import OrderManagement from '../../Admin/views/OrderManagement';
import ForgotPassword from '../../Admin/views/ForgotPassword';
import StatisticsManagement from '../../Admin/views/StatisticsManagement';
import Staff from '../../staff/pages/StaffDashboard';

const AppUser = () => {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

    const noHeaderFooterRoutes = ['/staff-dashboard', '/forgot-password', '/create-account', '/login', '/admin-system', '/product-management', '/order-management', '/promotion-management', '/user-management', '/statistics-management'];

    return (
        <>
            {!noHeaderFooterRoutes.includes(location.pathname) && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product-detail" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckOut />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create-account" element={<CreatAccount />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin-system" element={<AdminLayout />} />
                <Route path="/product-management" element={<ProductManagement />} />
                <Route path="/order-management" element={<OrderManagement />} />
                <Route path="/promotion-management" element={<PromotionManagement />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/statistics-management" element={<StatisticsManagement />} />
                <Route path="/staff-dashboard" element={<Staff />} />
            </Routes>
            {!noHeaderFooterRoutes.includes(location.pathname) && <Footer />}
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
