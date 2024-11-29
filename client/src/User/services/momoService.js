import axios from 'axios';

export const processMoMoPayment = async (amount) => {
  try {
    const response = await fetch('/api/momo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        orderId: `order_${Date.now()}`,
        requestId: `req_${Date.now()}`,
        partnerCode: 'YOUR_PARTNER_CODE',
        redirectUrl: 'https://yourdomain.com/payment/callback',
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('MoMo Payment Error:', error);
    return { success: false };
  }
};


export const processQRPay = async (amount) => {
  try {
    // Tích hợp API QR Pay
    const response = await fetch('/api/qrpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    return await response.json();
  } catch (error) {
    console.error('QR Pay Error:', error);
    return { success: false };
  }
};

export const processPayPal = async (amount) => {
  try {
    // Tích hợp PayPal API
    const response = await fetch('/api/paypal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    return await response.json();
  } catch (error) {
    console.error('PayPal Error:', error);
    return { success: false };
  }
};
