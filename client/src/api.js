import axios from 'axios';

// Get all watches
export const getAllWatches = async () => {
    try {
        const response = await axios.get('/api/watches');
        return response.data;
    } catch (error) {
        console.error('Error fetching watches', error);
        throw error;
    }
};

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post('/api/users/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user', error);
        throw error;
    }
};

// Login user
export const loginUser = async (loginData) => {
    try {
        const response = await axios.post('/api/users/login', loginData);
        return response.data;
    } catch (error) {
        console.error('Error logging in', error);
        throw error;
    }
};
