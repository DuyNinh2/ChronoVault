import React, { useEffect, useState } from 'react';
import '../../Admin/styles/common.scss';
import accountIcon from '../../Admin/assets/images/account.png';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate thay vì useHistory

const Header = () => {
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false); // Trạng thái xổ xuống
    const navigate = useNavigate(); // Thay thế useHistory bằng useNavigate

    const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
            setShowHeader(false); // Cuộn xuống - ẩn header
        } else {
            setShowHeader(true); // Cuộn lên - hiển thị header
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Hàm mở hoặc đóng menu dropdown
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        // Xóa thông tin đăng nhập (ví dụ: token trong localStorage)
        localStorage.removeItem('userToken');
        // Điều hướng đến trang login
        navigate('/login'); // Thay history.push thành navigate
    };

    return (
        <header className={`header ${showHeader ? "visible" : "hidden"}`}>
            <div className="header-top">
                <div className="brand">ChronoVault</div>
                <div className="account-icon" onClick={toggleDropdown}>
                    <img className="account" src={accountIcon} alt="Account" />
                </div>
                {showDropdown && (
                    <div className="dropdown-menu">
                        <button onClick={handleLogout}>Log out</button>
                    </div>
                )}
            </div>
            <div className="admin-banner">
                Admin Dashboard
            </div>
        </header>
    );
};

export default Header;
