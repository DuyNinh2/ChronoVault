import React from 'react';
import OrderItem from './OrderItem';
import '../styles/OrderSummary.scss';

const OrderSummary = () => {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <div className="total">
        <span>Total</span>
        <span>$850.00</span>
      </div>

      <OrderItem name="Watch Name" quantity={2} price={500} />
      <OrderItem name="Watch Name" quantity={1} price={350} />
    </div>
  );
};

export default OrderSummary;
