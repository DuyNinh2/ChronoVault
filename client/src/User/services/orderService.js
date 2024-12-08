import axios from 'axios';

export const createOrder = (order) => {
  return axios.post('/api/orders', order)
    .then(response => response.data)
    .catch(error => { throw error; });
};


export const getUserOrders = async (userID) => {
  try {
    const response = await axios.get(`/api/orders/user/${userID}`);
    return response.data; // Trả về dữ liệu đơn hàng
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};
