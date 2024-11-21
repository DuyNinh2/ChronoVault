import axios from 'axios';

export const fetchCartItems = async (userID) => {
  const response = await fetch(`/api/cart?userID=${userID}`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }
  return response.json();
};

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


export const updateCartQuantity = async (userID, itemID, quantity) => {
  const response = await fetch(`/api/cart/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userID, itemID, quantity }),
  });

  if (!response.ok) {
    throw new Error('Failed to update quantity');
  }
  return response.json();
};
