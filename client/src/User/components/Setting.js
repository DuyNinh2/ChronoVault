import React, { useEffect, useState } from "react";
import { getUserSettings, updateUserSettings, addNewAddress, deleteUserAddress, changePassword } from "../services/userService";
import { getCurrentUserID } from "../services/authService";
import vietnamCities from "../services/vietnamCities";
import "../styles/Setting.scss";

const Setting = () => {
  const userID = getCurrentUserID();
  const [selectedTab, setSelectedTab] = useState("AccountDetails");
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: [{
      country: 'Vietnam',
      city: '',
      district: '',
      street: '',
    }],
    password: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newAddress, setNewAddress] = useState({
    country: 'Vietnam',
    city: '',
    district: '',
    street: '',
  });

  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle empty or null dates
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserSettings(userID);
        setFormData({
          ...data,
          address: data.address.length > 0 ? data.address : [],
        });
      } catch (error) {
        console.error("Failed to fetch user settings", error);
      }
    };
    fetchData();
  }, [userID]);
  console.log(formData);

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      const updatedAddresses = [...formData.address];
      updatedAddresses[index][name] = value;

      if (name === "city") {
        updatedAddresses[index].district = ""; // Reset district when city changes
      }

      setFormData({
        ...formData,
        address: updatedAddresses,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value,
    });

    if (name === "city") {
      setNewAddress((prevState) => ({
        ...prevState,
        district: "", // Reset district when city changes
      }));
    }
  };
  // console.log(newAddress);

  const handleSave = async (section) => {
    try {
      const { address, ...rest } = formData;
      const dataToUpdate = {
        ...rest,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        address, // Gửi toàn bộ danh sách địa chỉ
      };
  
      await updateUserSettings(userID, dataToUpdate); // Gọi API cập nhật
      alert(`${section} updated successfully!`);
      setIsEditing(false);
      setIsAdding(false);
    } catch (error) {
      console.error(`Failed to update ${section}`, error);
      alert(`Failed to update ${section}`);
    }
  };
  

  const addAddress = () => {
    setIsAdding(true);
  };

  const handleAddNewAddress = async () => {
    try {
      await addNewAddress(userID, newAddress); // Gọi API từ userService
      const updatedAddresses = [...formData.address, newAddress];
      setFormData({
        ...formData,
        address: updatedAddresses,
      });
      setNewAddress({
        country: 'Vietnam',
        city: '',
        district: '',
        street: '',
      });
      setIsAdding(false);
      alert('New address added successfully!');
    } catch (error) {
      console.error('Failed to add new address', error);
      alert('Failed to add new address');
    }
  };

  const handleDeleteAddress = async (index, addressID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;
  
    try {
      await deleteUserAddress(userID, addressID); // Gọi API xóa
      const updatedAddresses = formData.address.filter((_, i) => i !== index); // Xóa địa chỉ khỏi state
      setFormData({
        ...formData,
        address: updatedAddresses,
      });
      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Failed to delete address", error);
      alert("Failed to delete address");
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = formData;
  
    // Kiểm tra các điều kiện đầu vào
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill in all the fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New Password and Confirm New Password do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      alert("New Password cannot be the same as Current Password.");
      return;
    }
  
    try {
      // Gọi hàm service để thay đổi mật khẩu
      await changePassword(userID, { currentPassword, newPassword });
      alert("Password changed successfully!");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password", error);
      alert(error.response?.data?.message || "Failed to change password.");
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setIsAdding(false);
  };

  const getDistrictOptions = (cityName) => {
    const city = vietnamCities.find((c) => c.name === cityName);
    return city ? city.districts : [];
  };

  const renderAccountDetails = () => (
    <div className="account-details">
      <h3>Account Details</h3>
      <label>Email*</label>
      <input type="email" name="email" value={formData.email} disabled />

      <label>Phone Number</label>
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
      />

      <label>Date of Birth*</label>
      <input
        type="date"
        name="dateOfBirth"
        value={formatDate(formData.dateOfBirth)}
        onChange={handleInputChange}
      />

      <button className="save-button" onClick={() => handleSave('Account Details')}>
        Save
      </button>
    </div>
  );

  const renderDeliveryAddress = () => (
    <div className="delivery-address">
      <h3>Saved Delivery Addresses</h3>
      {formData.address.length === 0 ? (
        // Nếu không có địa chỉ, chỉ hiển thị nút Add Address
        <button className="add-button" onClick={addAddress}>
          Add Address
        </button>
      ) : (
        <>
          {formData.address.map((address, index) => (
            <div key={index} className="address-block">
              <label>{index === 0 ? "Default Delivery Address" : `Address ${index + 1}`}</label>
              <p>{address.street}</p>
              <p>{address.district}, {address.city} {address.country}</p>
              <button className="edit-button" onClick={() => handleEdit(index)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteAddress(index, address._id)}>Delete</button>
            </div>
          ))}
          <button className="add-button" onClick={addAddress}>
            Add Address
          </button>
        </>
      )}
  
      {isEditing && (
        <div className="modal">
          <button className="close-button" onClick={closeModal}>X</button>
          <h3>Edit Address</h3>
          <label>Street</label>
          <input
            type="text"
            name="street"
            value={formData.address[editingIndex].street}
            onChange={(e) => handleInputChange(e, editingIndex)}
          />
  
          <label>City</label>
          <select
            name="city"
            value={formData.address[editingIndex].city}
            onChange={(e) => handleInputChange(e, editingIndex)}
          >
            <option value="">Select City</option>
            {vietnamCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
  
          <label>District</label>
          <select
            name="district"
            value={formData.address[editingIndex].district}
            onChange={(e) => handleInputChange(e, editingIndex)}
            disabled={!formData.address[editingIndex].city}
          >
            <option value="">Select District</option>
            {getDistrictOptions(formData.address[editingIndex].city).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
  
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.address[editingIndex].country}
            onChange={(e) => handleInputChange(e, editingIndex)}
            disabled
          />
  
          <button className="save-button" onClick={() => handleSave(`Address ${editingIndex + 1}`)}>
            Save
          </button>
        </div>
      )}
  
      {isAdding && (
        <div className="modal">
          <button className="close-button" onClick={closeModal}>X</button>
          <h3>Add Address</h3>
          <label>Street</label>
          <input
            type="text"
            name="street"
            value={newAddress.street}
            onChange={handleNewAddressChange}
          />
  
          <label>City</label>
          <select
            name="city"
            value={newAddress.city}
            onChange={handleNewAddressChange}
          >
            <option value="">Select City</option>
            {vietnamCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
  
          <label>District</label>
          <select
            name="district"
            value={newAddress.district}
            onChange={handleNewAddressChange}
            disabled={!newAddress.city}
          >
            <option value="">Select District</option>
            {getDistrictOptions(newAddress.city).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
  
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={newAddress.country}
            onChange={handleNewAddressChange}
            disabled
          />
  
          <button className="save-button" onClick={handleAddNewAddress}>
            Add
          </button>
        </div>
      )}
    </div>
  );  

  const renderPassword = () => (
    <div className="password">
      <h3>Password</h3>
      <label>Current Password</label>
      <input
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleInputChange}
      />

      <label>New Password</label>
      <input
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleInputChange}
      />

      <label>Confirm New Password</label>
      <input
        type="password"
        name="confirmNewPassword"
        value={formData.confirmNewPassword}
        onChange={handleInputChange}
      />
      <button className="save-button" onClick={handleChangePassword}>
        Save
      </button>
    </div>
  );

  return (
    <div className="setting-container">
      <h2>Settings</h2>
      <hr />
      <div className="main-content">
        <div className="sidebar">
          <button
            onClick={() => setSelectedTab("AccountDetails")}
            className={selectedTab === "AccountDetails" ? "active" : ""}
          >
            Account Details
          </button>
          <button
            onClick={() => setSelectedTab("DeliveryAddress")}
            className={selectedTab === "DeliveryAddress" ? "active" : ""}
          >
            Delivery Address
          </button>
          <button
            onClick={() => setSelectedTab("Password")}
            className={selectedTab === "Password" ? "active" : ""}
          >
            Password
          </button>
        </div>
        <div className="content">
          {selectedTab === "AccountDetails" && renderAccountDetails()}
          {selectedTab === "DeliveryAddress" && renderDeliveryAddress()}
          {selectedTab === "Password" && renderPassword()}
        </div>
      </div>
    </div>
  );
};

export default Setting;
