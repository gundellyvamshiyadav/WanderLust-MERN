const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Booking = require("../models/bookings");
const { isLoggedIn } = require("../middleware");
const axios = require("axios"); 

router.post("/create-order", isLoggedIn, async (req, res) => {
  try {
    const { listingId, fromDate, toDate, guests, fullName, phone, notes } =
      req.body;

    const listing = await Listing.findById(listingId);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });

    const nights = Math.ceil(
      (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0)
      return res.status(400).json({ message: "Invalid date range." });

    const totalPrice = Math.round(nights * listing.price * 1.18);

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      fromDate,
      toDate,
      guests,
      fullName,
      phone,
      notes,
      totalPrice,
      status: "Pending",
    });
    await booking.save();

    const clientReturnUrl = `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/booking/status/${booking._id}`;

    const cashfreeAppId = process.env.CASHFREE_APP_ID || process.env.CLIENT_ID;
    const cashfreeSecretKey =
      process.env.CASHFREE_SECRET_KEY || process.env.CLIENT_SECRET;
    const cashfreeApiUrl =
      process.env.CASHFREE_API_URL || "https://sandbox.cashfree.com/pg";

    const orderData = {
      order_id: booking._id.toString(),
      order_amount: totalPrice,
      order_currency: "INR",
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_name: fullName,
        customer_email: req.user.email,
        customer_phone: phone,
      },
      order_meta: { return_url: clientReturnUrl },
    };

    const cashfreeResponse = await axios.post(
      `${cashfreeApiUrl}/orders`,
      orderData,
      {
        headers: {
          "x-api-version": "2022-09-01", 
          "Content-Type": "application/json",
          "x-client-id": cashfreeAppId,
          "x-client-secret": cashfreeSecretKey,
        },
      }
    );
    console.log(
      "Full Cashfree response:",
      JSON.stringify(cashfreeResponse.data, null, 2)
    );
    const paymentSessionId = cashfreeResponse.data.payment_session_id;

    if (!paymentSessionId) {
      throw new Error("Failed to get payment session ID from Cashfree.");
    }

    res.status(200).json({
      success: true,
      bookingId: booking._id,
      paymentSessionId: paymentSessionId, 
      totalPrice: totalPrice,
      cashfreeMode: "sandbox", 
    });
  } catch (err) {
    console.error("---! ERROR IN CREATE-ORDER ENDPOINT !---");
    if (err.response) {
      console.error("Cashfree API Error:", err.response.data);
    } else {
      console.error(err.message);
    }
    res
      .status(500)
      .json({ message: "Failed to initiate payment. Check server logs." });
  }
});

router.post("/verify-payment", isLoggedIn, async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findByIdAndUpdate(bookingId, {
    status: "Booked",
  });
  if (booking) {
    res
      .status(200)
      .json({
        success: true,
        message: "Your booking is confirmed! (Verification placeholder)",
      });
  }
});

module.exports = router;
