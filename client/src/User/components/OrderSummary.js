import React from 'react';
import { addDays, format } from 'date-fns';
import '../styles/OrderSummary.scss';

const OrderSummary = ({ cartItems }) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const deliveryCost = 10; 
  const totalAmount = subtotal + deliveryCost;

  const currentDate = new Date(); 
  const deliveryStartDate = addDays(currentDate, 5); 
  const deliveryEndDate = addDays(currentDate, 7); 
  const formattedStartDate = format(deliveryStartDate, 'EEE, MMM d'); 
  const formattedEndDate = format(deliveryEndDate, 'EEE, MMM d');

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <div className="summary-totals">
        <div className="subtotal">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="delivery-cost">
          <span>Delivery/Shipping</span>
          <span>${deliveryCost.toLocaleString()}</span>
        </div>
        <div className="total">
          <span>Total</span>
          <span>${totalAmount.toLocaleString()}</span>
        </div>
      </div>
      <div className="delivery-date">
        <span>Arrives {formattedStartDate} - {formattedEndDate}</span>
      </div>
      <div className="items-list"> 
        {cartItems.map((item) => ( 
          <div className="order-item" key={item._id}> 
            <div className="item-image"> 
              <img src={item.product.image} alt={item.product.name} /> 
            </div> 
            <div className="item-details"> 
              <p className="item-name">{item.product.name}</p> 
              <p className="item-quantity">Qty: {item.quantity}</p> 
              <p className="item-price">${item.product.price.toLocaleString()}</p> 
            </div> 
          </div> 
        ))} 
      </div>
    </div>
  );
};

export default OrderSummary;
