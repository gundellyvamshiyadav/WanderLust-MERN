import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import apiClient from '../api';

const PaymentStatusPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await apiClient(`/bookings/verify-payment`, {
          method: "POST",
          body: JSON.stringify({ bookingId }),
        });
        setStatus("success");
        setMessage(data.message || "Payment successful! Your booking is confirmed.");
      } catch (err) {
        setStatus("failed");
        setMessage("Error verifying payment.");
      }
    };
    checkStatus();
  }, [bookingId]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="container my-5 text-center">
      <h2 className="mb-4">Payment Status</h2>
      <div
        className={`alert ${
          status === "success" ? "alert-success" : "alert-danger"
        }`}
      >
        {message}
      </div>
      <Link to="/" className="btn btn-primary mt-3">
        Go to Home
      </Link>
    </div>
  );
};

export default PaymentStatusPage;
