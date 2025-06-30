import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const BookingPage = () => {
    const { id: listingId } = useParams();
    const navigate = useNavigate();
    const { curUser } = useAuth();
    const { addNotification } = useNotification();
    
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);
    
    const [bookingDetails, setBookingDetails] = useState({
        fromDate: '',
        toDate: '',
        guests: 1,
        fullName: curUser?.username || '',
        phone: '',
        notes: ''
    });

    useEffect(() => {
        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/listings/${listingId}`);
                if (!response.ok) throw new Error('Listing not found.');
                const data = await response.json();
                setListing(data);
            } catch (err) {
                addNotification(err.message, 'error');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };
        fetchListing();
    }, [listingId, navigate, addNotification]);
    
    const handleChange = (e) => {
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        const { fromDate, toDate } = bookingDetails;
        const from = new Date(fromDate);
        const to = new Date(toDate);
        if (to <= from) {
            e.stopPropagation();
            setValidated(true);
            addNotification("Check-out date must be after the check-in date.", 'error');
            const toDateInput = form.querySelector('#toDate');
            if (toDateInput) toDateInput.setCustomValidity("Invalid date range.");
            return;
        } else {
            const toDateInput = form.querySelector('#toDate');
            if (toDateInput) toDateInput.setCustomValidity("");
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/bookings/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId, ...bookingDetails })
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Could not initiate booking.');
            }

            console.log("--- Received from server in BookingPage ---");
            console.log(JSON.stringify(data, null, 2));

            if (!data.bookingId || !data.paymentSessionId) {
                throw new Error("Server response is missing required payment details.");
            }
            navigate(`/payment/${data.bookingId}`, {
                state: {
                    paymentSessionId: data.paymentSessionId, 
                    totalPrice: data.totalPrice,
                    cashfreeMode: data.cashfreeMode
                }
            });
            
        } catch (err) {
            console.error("Error during booking submission:", err);
            addNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!curUser) {
        return (
            <div className="container text-center mt-5">
                <h3>Login Required</h3>
                <p>You must be logged in to book a listing.</p>
                <Link to="/login" state={{ from: { pathname: `/bookings/${listingId}/book` } }} className="btn btn-primary">
                    Login to Continue
                </Link>
            </div>
        );
    }
    
    if (isLoading) {
        return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" /></div>;
    }

    if (!listing) return null;

    return (
        <div className="container my-5 d-flex justify-content-center">
            <div className="col-lg-8">
                <h2 className="mb-4 fw-semibold">
                    <span className="reserve dark-mode">Reserve </span>
                    <span className="text-primary">{listing.title}</span>
                </h2> 
                <form onSubmit={handleSubmit} className={`booking-form-custom p-4 rounded shadow-sm ${validated ? 'was-validated' : ''}`} noValidate>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="fromDate" className="form-label">Check-In</label>
                            <input type="date" className="form-control" id="fromDate" name="fromDate" value={bookingDetails.fromDate} onChange={handleChange} required />
                            <div className="invalid-feedback">Please select a check-in date.</div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="toDate" className="form-label">Check-Out</label>
                            <input type="date" className="form-control" id="toDate" name="toDate" value={bookingDetails.toDate} onChange={handleChange} required />
                            <div className="invalid-feedback">Please select a check-out date after the check-in date.</div>
                        </div>
                    </div>
                     <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input type="tel" className="form-control" id="phone" name="phone" placeholder="9876543210" value={bookingDetails.phone} onChange={handleChange} required pattern="\d{10}" />
                        <div className="invalid-feedback">Please enter a valid 10-digit phone number.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="guests" className="form-label">Number of Guests</label>
                        <input type="number" className="form-control" id="guests" name="guests" min="1" value={bookingDetails.guests} onChange={handleChange} required />
                        <div className="invalid-feedback">Please enter at least 1 guest.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Full Name</label>
                        <input type="text" className="form-control" id="fullName" name="fullName" value={bookingDetails.fullName} onChange={handleChange} required />
                        <div className="invalid-feedback">Please enter your full name.</div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="notes" className="form-label">Notes (Optional)</label>
                        <textarea className="form-control" id="notes" name="notes" value={bookingDetails.notes} onChange={handleChange} rows="3"></textarea>
                    </div>
                     <button type="submit" className="btn btn-success w-100 rounded-pill py-2" disabled={isSubmitting || isLoading}>
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;