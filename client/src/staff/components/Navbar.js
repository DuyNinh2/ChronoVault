import React, { useState } from "react";
import "../../staff/styles/Navbar.scss";

const Navbar = ({ staffInfo, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <nav className="navbar">
            <h1>Staff Dashboard</h1>
            <div className="user-menu">
                <span className="user-info" onClick={toggleDropdown}>
                    {staffInfo?.name || "Tài khoản"}
                </span>
                {showDropdown && (
                    <div className="dropdown-menu">
                        {/* <p>Username: {staffInfo?.name}</p>
                        <p>Email: {staffInfo?.email}</p> */}
                        <button onClick={onLogout} className="logout-btn">Đăng xuất</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
