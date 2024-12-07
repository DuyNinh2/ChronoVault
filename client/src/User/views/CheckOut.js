import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.scss';
import { fetchCartItems, clearCartItems } from '../services/cartService';
import { getCurrentUserID } from '../services/authService';
import { fetchUserData, saveUserAddress } from '../services/userService';
import { addDays, format } from 'date-fns';
import vietnamCities from '../services/vietnamCities';
import { createOrder } from '../services/orderService';
import { processQRPay, processPayPal, processMoMoPayment } from '../services/momoService';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [street, setStreet] = useState('');
  const [paypalPaymentComplete, setPaypalPaymentComplete] = useState(false);


  const navigate = useNavigate();
  const userID = getCurrentUserID();

  useEffect(() => {
    if (selectedPayment === 'PayPal') {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalAmount.toFixed(2),
                },
              },
            ],
            application_context: {
              "shipping_preference": "NO_SHIPPING"
            },
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log('Order approved:', order);
          setPaypalPaymentComplete(true);
          //alert('PayPal payment completed successfully.');
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          alert('PayPal payment failed.');
        },
      }).render('#paypal-button-container');
    }
  }, [selectedPayment]);

  useEffect(() => {
    if (paypalPaymentComplete) {
      console.log('paypalPaymentComplete updated:', paypalPaymentComplete);
      handlePlaceOrder();
    }
  }, [paypalPaymentComplete]);

  useEffect(() => {
    if (userID) {
      fetchCartItems(userID)
        .then((items) => setCartItems(items))
        .catch((err) => console.error('Error fetching cart items:', err));
    }
  }, [userID]);

  useEffect(() => {
    fetchUserData()
      .then((data) => {
        setUserData(data);
        setSelectedCity(data.address[0]?.city || '');
        setSelectedDistrict(data.address[0]?.district || '');
        setStreet(data.address[0]?.street || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const cityData = vietnamCities.find((city) => city.name === selectedCity);
    setDistricts(cityData ? cityData.districts : []);
    if (!cityData) setSelectedDistrict('');
  }, [selectedCity]);

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
  };

  const handlePlaceOrder = async () => {
    if (!street || !selectedCity || !selectedDistrict) {
      alert('Please complete all delivery information.');
      return;
    }

    if (!selectedPayment) {
      alert('Please select a payment method.');
      return;
    }

    if (selectedPayment === 'PayPal') {
      if (!paypalPaymentComplete) {
        alert('Please complete PayPal payment first.');
        return;
      }
    } else {
      let paymentResult = { success: true };
      if (selectedPayment === 'QR Pay') {
        paymentResult = await processQRPay(totalAmount);
      } else if (selectedPayment === 'MoMo') {
        paymentResult = await processMoMoPayment(totalAmount);
      }

      if (!paymentResult.success) {
        alert(`${selectedPayment} payment failed.`);
        return;
      }
    }

    if (!userData.address || !userData.address.length) {
      const address = { street, city: selectedCity, district: selectedDistrict, country: 'Vietnam' };
      await saveUserAddress(userID, address);
    }

    const newOrder = {
      userID,
      total_amount: totalAmount,
      delivery_date: addDays(new Date(), 7),
      assignedStaff: null,
      items: cartItems.map(item => ({
        watchID: item.watchId,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    await createOrder(newOrder);
    await clearCartItems(userID);
    alert('Order placed successfully!');
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>Error loading user data.</p>;

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
    <div className="checkout-page">
      <div className="deli-pay">
        <div className="delivery">
          <h2>Delivery</h2>
          <form className="delivery-form">
            <p>Enter your name and address:</p>
            <input type="text" placeholder="Name" defaultValue={userData.username} readOnly />
            <input type="text" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
            <div className="dropdowns">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="" disabled>
                  Select City
                </option>
                {vietnamCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="" disabled>
                  Select District
                </option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <h3>What's your contact information?</h3>
            <input type="email" placeholder="Email" defaultValue={userData.email} readOnly />
            <p className="note">A confirmation email will be sent after checkout.</p>
            <input type="tel" placeholder="Phone Number" defaultValue={userData.phone} readOnly />
            <p className="note">A carrier might contact you to confirm delivery.</p>
          </form>
        </div>
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
            {selectedPayment === 'PayPal' && (
              <div id="paypal-button-container"></div>
            )}
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
      </div>
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
    </div>
  );
};

export default CheckoutPage;
