import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import "../assets/css/PaymentPage.css";


const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState('Verifying...');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const order_id = searchParams.get('order_id');
        const order_token = searchParams.get('order_token'); 

        const verifyPayment = async () => {
            if (!order_id) {
                setPaymentStatus('Failed');
                setMessage('No order ID found in URL. Payment status unknown.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/payments/verify?order_id=${order_id}&order_token=${order_token || ''}`);

                if (response.data.success) {
                    setPaymentStatus('Success!');
                    setMessage('Your payment was successful. Thank you for your booking!');
                } else {
                    setPaymentStatus('Failed');
                    setMessage(response.data.message || 'Payment could not be verified. Please contact support if you believe this is an error.');
                }
            } catch (err) {
                console.error('Error verifying payment:', err);
                setPaymentStatus('Error');
                setMessage('There was an error verifying your payment. Please contact support.');
            } finally {
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams]); 

    return (
        <div className="container my-5 text-center">
            <div className="card shadow-sm border-0 rounded-4 p-4">
                <h4 className="mb-3 fw-semibold">Payment Status</h4>
                {isLoading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <>
                        {paymentStatus === 'Success!' && (
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                        )}
                        {paymentStatus === 'Failed' && (
                            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
                        )}
                        {paymentStatus === 'Error' && (
                            <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '3rem' }}></i>
                        )}
                        <h5 className="mt-3">{paymentStatus}</h5>
                    </>
                )}
                <p className="mt-2">{message}</p>
                <a href="/" className="btn btn-primary mt-3">Go to Home</a>
            </div>
        </div>
    );
};

export default PaymentStatusPage;