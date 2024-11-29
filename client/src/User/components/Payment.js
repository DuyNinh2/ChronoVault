import React, { useState } from 'react';
import '../styles/Payment.scss';

const PaymentSection = () => {
  const [selectedPayment, setSelectedPayment] = useState('');

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
  };

  const handlePlaceOrder = () => {
    // Place order logic here
    alert(`Order placed with ${selectedPayment}`);
  };

  return (
    <div className="payment-section">
      <h2>Payment</h2>
      <div className="payment-options">
        <label>How would you like to pay?</label>
        <div 
          className={`payment-option ${selectedPayment === 'QR Pay' ? 'selected' : ''}`}
          onClick={() => handlePaymentSelection('QR Pay')}
        >
          <span>QR Pay</span>
        </div>
        <div 
          className={`payment-option ${selectedPayment === 'PayPal' ? 'selected' : ''}`}
          onClick={() => handlePaymentSelection('PayPal')}
        >
          <span>PayPal</span>
        </div>
        <div 
          className={`payment-option ${selectedPayment === 'MoMo' ? 'selected' : ''}`}
          onClick={() => handlePaymentSelection('MoMo')}
        >
          <span>MoMo</span>
        </div>
      </div>

      <button className="place-order-button" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default PaymentSection;
