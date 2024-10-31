import React from 'react';
import '../styles/DeliveryForm.scss';

const DeliveryForm = () => {
  return (
    <div className="delivery">
      <h2>Delivery</h2>
      <form className="delivery-form">
        <p>Enter your name and address:</p>
        <p>If you have a promo code, you will be able to input it after filling in your contact details.</p>

        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="text" placeholder="Address" />

        <div className="dropdowns">
          <select>
            <option>Districts</option>
          </select>
          <select>
            <option>City</option>
          </select>
        </div>

        <h3>What's your contact information?</h3>
        <input type="email" placeholder="Email" />
        <p className="note">A confirmation email will be sent after checkout.</p>
        <input type="tel" placeholder="Phone Number" />
        <p className="note">A carrier might contact you to confirm delivery.</p>
      </form>
    </div>
  );
};

export default DeliveryForm;
