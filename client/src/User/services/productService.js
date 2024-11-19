import axios from 'axios';

const API_URL = '/api/watches';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
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