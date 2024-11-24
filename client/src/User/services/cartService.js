import axios from 'axios';

export const addToCart = async (userID, watchID, quantity) => {
  try {
    const response = await axios.post('/api/cart/add', {
      userID,
      watchID,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to add item to cart');
  }
};

export const fetchCartItems = async (userID) => {
  try {
    const response = await axios.post('/api/cart', { userID });
    const cartItems = response.data.cartItems;
    // console.log('Cart Items:', cartItems);
    return cartItems; 
  } catch (error) {
    console.error('Error fetching cart items:', error.response?.data || error.message);
    return []; 
  }
};

export const updateCartQuantity = async (userID, watchID, quantity) => {
  try {
    console.log(quantity);
    const response = await axios.post('/api/cart/updatequantity', { userID, watchID, quantity });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update cart quantity');
  }
};

export const removeCartItem = async (userID, watchID) => {
  try {
    const response = await axios.post('/api/cart/removewatch', {
      userID,
      watchID,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
  }
};

