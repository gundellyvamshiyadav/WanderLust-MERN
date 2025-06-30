import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import apiClient from '../api';

const BookingStatusPage = () => {
    const { bookingId } = useParams();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState('Verifying your payment, please wait...');
    const [isSuccess, setIsSuccess] = useState(null); 

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const data = await apiClient('/bookings/verify-payment', {
                    method: 'POST',
                    body: JSON.stringify({ bookingId })
                });
                if (!data.success) {
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

     useEffect(() => {
        if (isSuccess === true) {
            addNotification("Redirecting to your dashboard...", "success");
            const timer = setTimeout(() => {
                navigate('/dashboard');
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]); 

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
