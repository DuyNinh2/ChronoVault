import axios from 'axios';

const API_URL = '/api/watches';

export const fetchProducts = async (filters) => {
  try {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchDiscountedProducts = async () => {
  try {
    const response = await axios.get('/api/products/discounted-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    throw error;
  }
};

export const toggleWishlist = async (userID, watchID) => {
  try {
    const response = await axios.post(`/api/products/${userID}/wishlist`, { watchID });
    return response.data; // Trả về danh sách wishlist mới hoặc thông báo
  } catch (error) {
    console.error('Error toggling wishlist:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchRelatedProducts = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}?limit=5&sort=desc`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest products:", error);
    throw error;
  }
};