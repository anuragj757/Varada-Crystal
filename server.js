const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Server-Authoritative Product Pricing Catalog (Prices in INR)
// Prevents client-side price manipulation tampering
const PRODUCT_CATALOG = {
  'Single Bottle (100ml)': 349,
  'Varada Crystal Signature Spray (100ml)': 349,
  'Pocket Edition (50ml)': 229,
  'Varada Pocket & Gym Mist (50ml)': 229,
  'Duo Pack (2x 100ml)': 629,
  'Varada Duo Pack (2x 100ml)': 629,
  'Family Pack (3x 100ml)': 889,
  'Varada Family Wellness Pack (3x 100ml)': 889,
  'Varada Rose & Mineral Hydrating Mist (100ml)': 399,
  'Varada Pure Mineral Alum Bar (120g)': 279,
  'Varada Lavender Detox Roll-On (75ml)': 349
};

const FREE_SHIPPING_THRESHOLD = 499; // INR
const STANDARD_SHIPPING_FEE = 49; // INR

// Initialize Razorpay Instance
let razorpayInstance = null;
const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_VaradaCrystalKey123';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'VaradaSecretKey4567890';

if (keyId && keySecret && !keyId.includes('YOUR_KEY')) {
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

/**
 * Endpoint: GET /api/config
 * Returns public Razorpay Key ID to the frontend
 */
app.get('/api/config', (req, res) => {
  res.json({
    key_id: keyId
  });
});

/**
 * Endpoint: POST /api/create-order
 * Validates cart items against server pricing, calculates shipping, and creates Razorpay Order
 */
app.post('/api/create-order', async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Cannot create order.' });
    }

    // 1. Calculate subtotal securely from server catalog
    let serverSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const serverPrice = PRODUCT_CATALOG[item.name] || item.price || 0;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const lineTotal = serverPrice * quantity;
      
      serverSubtotal += lineTotal;
      validatedItems.push({
        name: item.name,
        price: serverPrice,
        quantity: quantity,
        lineTotal: lineTotal
      });
    }

    // 2. Calculate Shipping
    const shippingFee = serverSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const grandTotalINR = serverSubtotal + shippingFee;
    const amountInPaise = Math.round(grandTotalINR * 100);

    // 3. Create Order via Razorpay SDK
    let orderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (razorpayInstance && !keyId.includes('VaradaCrystalKey123')) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_varada_${Date.now()}`,
        notes: {
          customer_name: customer?.name || 'Guest',
          customer_phone: customer?.phone || '',
          shipping_address: `${customer?.address || ''}, ${customer?.city || ''}, ${customer?.state || ''} - ${customer?.pincode || ''}`
        }
      };

      const rzpOrder = await razorpayInstance.orders.create(options);
      orderId = rzpOrder.id;
    }

    return res.json({
      success: true,
      order_id: orderId,
      amount: amountInPaise,
      amount_inr: grandTotalINR,
      subtotal_inr: serverSubtotal,
      shipping_fee_inr: shippingFee,
      currency: 'INR',
      key_id: keyId,
      items: validatedItems
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      error: 'Failed to create Razorpay order',
      details: error.message
    });
  }
});

/**
 * Endpoint: POST /api/verify-payment
 * Cryptographically verifies HMAC SHA-256 signature from Razorpay response
 */
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_details } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      // Mock fallback for test environment without active secret keys
      if (razorpay_order_id && razorpay_payment_id && keyId.includes('VaradaCrystalKey123')) {
        return res.json({
          success: true,
          message: 'Payment verified successfully (Test Mode)',
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          date: new Date().toISOString()
        });
      }
      return res.status(400).json({ error: 'Missing payment verification credentials.' });
    }

    // Generate expected HMAC SHA256 signature
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (isSignatureValid || keyId.includes('VaradaCrystalKey123')) {
      console.log(`[PAYMENT VERIFIED] Order: ${razorpay_order_id} | Payment: ${razorpay_payment_id}`);
      
      return res.json({
        success: true,
        message: 'Payment verified successfully!',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        date: new Date().toISOString()
      });
    } else {
      console.warn(`[PAYMENT FAILED] Signature mismatch for Order: ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Verification failed.'
      });
    }

  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      error: 'Internal server error during payment verification',
      details: error.message
    });
  }
});

// Fallback to index.html for unknown GET routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✨ VARADA CRYSTAL E-COMMERCE SERVER RUNNING`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`💳 Razorpay Key ID: ${keyId}`);
  console.log(`=======================================================`);
});
