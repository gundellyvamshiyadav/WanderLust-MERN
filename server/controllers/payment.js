// server/controllers/payment.js

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const axios = require("axios");
const {
  cashfreeAppId,
  cashfreeSecretKey,
  cashfreeApiUrl,
  cashfreeMode,
} = require("../config/cashfreeConfig");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const generateOrderId = () => {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

module.exports.createPaymentSession = wrapAsync(async (req, res, next) => {
  const { totalPrice, customerName, customerEmail, customerPhone, listingId } =
    req.body;

  if (!totalPrice || !customerEmail || !customerPhone || !customerName) {
    return res.render("payment", {
      totalPrice: 0,
      paymentSessionId: null,
      cashfreeMode: cashfreeMode,
      returnUrl: `${CLIENT_URL}/payment-status`,
      error:
        "Missing required payment details (totalPrice, customerName, customerEmail, customerPhone)",
    });
  }

  const orderId = generateOrderId();

  try {
    const response = await axios.post(
      `${cashfreeApiUrl}/orders`,
      {
        order_id: orderId,
        order_amount: totalPrice,
        order_currency: "INR",
        customer_details: {
          customer_id: req.user ? req.user._id.toString() : "guest_user",
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${CLIENT_URL}/payment-status?order_id={order_id}&order_token={order_token}`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": cashfreeAppId,
          "x-client-secret": cashfreeSecretKey,
          "x-api-version": "2022-01-01",
        },
      }
    );

    const paymentSessionId = response.data.payment_session_id;

    if (!paymentSessionId) {
      throw new ExpressError(
        "Failed to get payment session ID from Cashfree",
        500
      );
    }

    res.render("payment", {
      totalPrice,
      paymentSessionId,
      cashfreeMode,
      returnUrl: `${CLIENT_URL}/payment-status`,
      error: null,
    });
  } catch (err) {
    console.error(
      "Error creating Cashfree payment session:",
      err.response ? err.response.data : err.message
    );
    res.render("payment", {
      totalPrice,
      paymentSessionId: null,
      cashfreeMode,
      returnUrl: `${CLIENT_URL}/payment-status`,
      error:
        err.response?.data?.message ||
        "Failed to create payment session. Please try again.",
    });
  }
});

module.exports.verifyPaymentStatus = wrapAsync(async (req, res, next) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ExpressError(
      "Order ID is required to verify payment status",
      400
    );
  }

  try {
    const response = await axios.get(
      `${cashfreeApiUrl}/orders/${orderId}/status`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": cashfreeAppId,
          "x-client-secret": cashfreeSecretKey,
          "x-api-version": "2022-01-01",
        },
      }
    );

    const paymentStatus = response.data.order_status;
    const txStatus = response.data.tx_status;

    res.status(200).json({
      success: true,
      orderStatus: paymentStatus,
      transactionStatus: txStatus,
      message: `Payment status for order ${orderId}: ${paymentStatus}`,
    });
  } catch (err) {
    console.error(
      "Error verifying Cashfree payment status:",
      err.response ? err.response.data : err.message
    );
    throw new ExpressError(
      "Failed to verify payment status. Please try again.",
      err.response ? err.response.status : 500
    );
  }
});
