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
