import axios from 'axios';

export const getCurrentUserID = () => {
    const userID = localStorage.getItem('userId');
    // console.log('Retrieved userID:', userID);
    return userID;
  };

export const fetchUserData = async () => {
  const userID = getCurrentUserID(); 
  if (!userID) {
    throw new Error('User not logged in or userID not found');
  }

  try {
    const response = await axios.get(`/api/user/${userID}`); 
    return response.data; 
  } catch (err) {
    console.error('Error fetching user data:', err);
    throw err;
  }
};

export const saveUserAddress = (userID, address) => { 
  return axios.post(`/api/user/${userID}/address`, address) 
    .then(response => response.data) 
    .catch(error => { throw error; }); 
};


// Hàm fetchWishlist
export const fetchWishlist = async (userId) => {
  try {
    const response = await axios.get(`/api/user/wishlist/${userId}`);
    return response.data; // Trả về danh sách wishlist từ API
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error; // Quăng lỗi để xử lý tại nơi gọi hàm
  }
};

export const getUserSettings = async (userID) => {
  try {
    const response = await axios.get(`/api/user/setting/${userID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

export const updateUserSettings = async (userID, settings) => {
  try {
    const response = await axios.put(`/api/user/setting/${userID}`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

export const addNewAddress = async (userID, address) => {
  try {
    const response = await axios.post(`/api/user/add/${userID}/addresses`, address);
    return response.data;
  } catch (error) {
    console.error("Error adding new address", error);
    throw error;
  }
};

export const deleteUserAddress = async (userID, addressID) => {
  try {
    const response = await axios.delete(`/api/user/addresses/${userID}/${addressID}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

export const changePassword = async (userID, passwordData) => {
  try {
    const response = await axios.put(`/api/user/change-password/${userID}`, passwordData);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

