// CheckoutPage.js
import React from 'react';
import DeliveryForm from '../components/DeliveryForm';
import OrderSummary from '../components/OrderSummary';
import Payment from '../components/Payment';
import '../styles/Checkout.scss';

const CheckoutPage = () => {
  return (
    <div className="checkout-page">
        <div>
            <DeliveryForm />
            <Payment />
        </div>
        <OrderSummary />
    </div>
  );
};

export default CheckoutPage;
