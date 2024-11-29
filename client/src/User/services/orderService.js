import axios from 'axios';

export const createOrder = (order) => {
  return axios.post('/api/orders', order)
    .then(response => response.data)
    .catch(error => { throw error; });
};
