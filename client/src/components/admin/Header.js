import React, { useEffect, useState } from 'react';
import '../../styles/admin/common.scss';
import accountIcon from '../../assets/images/account.png';

const Header = () => {
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
            // Cuộn xuống - ẩn header
            setShowHeader(false);
        } else {
            // Cuộn lên - hiển thị header
            setShowHeader(true);
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <header className={`header ${showHeader ? "visible" : "hidden"}`}>
            <div className="header-top">
                <div className="brand">ChronoVault</div>
                <div className="account-icon">
                    <img className="account" src={accountIcon} alt="Account" />
                </div>
            </div>
            <div className="admin-banner">
                Admin Dashboard
            </div>
        </header>
    );
};

export default Header;
