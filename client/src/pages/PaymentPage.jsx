import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { load } from "@cashfreepayments/cashfree-js";

const PaymentPage = () => {
  const { state } = useLocation();
  const { addNotification } = useNotification();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    'Click "Pay Now" to proceed.'
  );

  const { paymentSessionId, totalPrice } = state || {};

  const handlePayNow = async () => {
    if (!paymentSessionId) {
      addNotification("Invalid payment session. Please try again.", "error");
      return;
    }
    setIsProcessing(true);
    console.log("[Cashfree] paymentSessionId:", paymentSessionId); 
    try {
      const cashfree = await load({
        mode: "sandbox", 
      });
      setStatusMessage(
        <>
          <div className="spinner-border spinner-border-sm" role="status"></div>
          <span className="ms-2">Redirecting to Cashfree...</span>
        </>
      );
      await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self", 
        onSuccess: function (order) {
          window.location.href = "/dashboard";
        },
        onFailure: function (order) {
          addNotification("Payment failed. Please try again.", "error");
          setStatusMessage(
            <span className="text-danger">❌ Payment failed.</span>
          );
          setIsProcessing(false);
        },
        onPending: function (order) {
          addNotification(
            "Payment is pending. Please check your dashboard.",
            "info"
          );
          setStatusMessage(
            <span className="text-warning">⏳ Payment pending.</span>
          );
          setIsProcessing(false);
        },
      });
    } catch (err) {
      console.error("Cashfree checkout error:", err);
      addNotification("Could not start the payment process.", "error");
      setStatusMessage(
        <span className="text-danger">❌ Could not start payment process.</span>
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h4 className="mb-3 text-center fw-semibold">Secure Payment</h4>
            <div className="text-center mb-3">
              <p className="mb-1">Amount to Pay</p>
              <h3 className="text-success fw-bold">
                ₹{totalPrice ? totalPrice.toLocaleString("en-IN") : "..."}
              </h3>
              <small className="text-muted">Including all charges</small>
            </div>
            <div className="d-grid mb-4">
              <button
                className="btn btn-success fw-semibold"
                onClick={handlePayNow}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </button>
            </div>
            <div className="mt-4 text-center small text-muted d-flex align-items-center justify-content-center">
              {statusMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
