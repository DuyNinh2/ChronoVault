const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment setup
const environment = new paypal.core.SandboxEnvironment(
  'AfZqvhS18g2py0Hvj_kV7J3vjyV1S6C8jsRnRsyauohK2Ge1MUbbhwbLe3BnhAGzUdtt4pTt_k8XOzn6', // Replace with PayPal sandbox client ID
  'EI4JKvWox6NPOS9_h38lXr-6t_3v7RZDeblzykA-p848TTZl9Fpw-y5rDem7kjAmKcIHifbV7yHOw3jR' // Replace with PayPal sandbox client secret
);
const client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal Order
router.post('/create-paypal-order', async (req, res) => {
  const { totalAmount } = req.body;
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: totalAmount,
        },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating PayPal order');
  }
});

// Capture PayPal Order
router.post('/capture-paypal-order', async (req, res) => {
  const { orderID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    res.json(capture.result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error capturing PayPal order');
  }
});

module.exports = router;
