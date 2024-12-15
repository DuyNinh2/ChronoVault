import React, { useRef, useState } from "react";
import Favourites from '../components/Favourites';
import Orders from "../components/Orders";
import Setting from "../components/Setting";
import { getCurrentUsername } from '../services/authService';
import "../styles/Profile.scss";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const userName = getCurrentUsername();

  // Tạo các ref cho từng phần
  const profileRef = useRef(null);
  const ordersRef = useRef(null);
  const favouritesRef = useRef(null);
  const settingsRef = useRef(null);

  // Hàm cuộn đến phần được chọn
  const scrollToSection = (sectionRef, sectionName) => {
    setActiveSection(sectionName);
    sectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="profile-container">
      {/* Menu */}
      <div className="profile-menu">
        <button
          className={activeSection === "Profile" ? "active" : ""}
          onClick={() => scrollToSection(profileRef, "Profile")}
        >
          Profile
        </button>
        <button
          className={activeSection === "Favourites" ? "active" : ""}
          onClick={() => scrollToSection(favouritesRef, "Favourites")}
        >
          Favourites
        </button>
        <button
          className={activeSection === "Orders" ? "active" : ""}
          onClick={() => scrollToSection(ordersRef, "Orders")}
        >
          Orders
        </button>
        <button
          className={activeSection === "Setting" ? "active" : ""}
          onClick={() => scrollToSection(settingsRef, "Setting")}
        >
          Setting
        </button>
      </div>

      {/* Nội dung từng phần */}
      <div ref={profileRef} className="section profile-details">
        <div className="avatar-placeholder"></div>
        <div className="profile-info">
          <h3 className="username">{userName}</h3>
          <p className="membership">Member</p>
        </div>
      </div>

      <div ref={favouritesRef} className="section">
        <Favourites/>
      </div>

      <div ref={ordersRef} className="section">
        <Orders/>
      </div>

      <div ref={settingsRef} className="section">
        <Setting/>
      </div>
    </div>
  );
};

export default Profile;
