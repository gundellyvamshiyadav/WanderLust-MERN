import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const BookingStatusPage = () => {
    const { bookingId } = useParams();
    const { addNotification } = useNotification();
    
    const [status, setStatus] = useState('Verifying your payment, please wait...');
    const [isSuccess, setIsSuccess] = useState(null); 

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const response = await fetch('/api/bookings/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId })
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Payment verification failed.');
                }
                setStatus(data.message);
                setIsSuccess(true);
            } catch (err) {
                setStatus(err.message);
                setIsSuccess(false);
                addNotification(err.message, 'error');
            }
        };

        const timer = setTimeout(verifyPayment, 2000); 
        return () => clearTimeout(timer);

    }, [bookingId, addNotification]);

    return (
        <div className="container my-5 text-center">
            <div className="card col-md-6 mx-auto p-4 shadow-sm">
                {isSuccess === null && (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                {isSuccess === true && <h2 className="text-success">✅ Payment Successful!</h2>}
                {isSuccess === false && <h2 className="text-danger">❌ Payment Failed</h2>}
                
                <p className="lead mt-3">{status}</p>
                
                {/* {isSuccess && <p>Your booking is confirmed.</p>} */}
                
                <div className="mt-4">
                    <Link to="/dashboard" className="btn btn-primary">Go to My Dashboard</Link>
                </div>
            </div>
        </div>
    );
};

export default BookingStatusPage;