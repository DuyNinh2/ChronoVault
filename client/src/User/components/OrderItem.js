import React from 'react';
import '../styles/OrderItem.scss';

const OrderItem = ({ name, quantity, price }) => {
  return (
    <div className="order-item">
      <div className="item-image"></div>
      <div className="item-info">
        <p>{name}</p>
        <p>Quantity: {quantity}</p>
        <p>${price}</p>
      </div>
    </div>
  );
};

export default OrderItem;
