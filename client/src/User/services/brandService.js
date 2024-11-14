import axios from 'axios';

export const fetchBrands = async () => {
  try {
    const response = await axios.get('/api/brands');
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};
