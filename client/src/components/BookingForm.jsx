// src/components/BookingForm.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BookingForm.css'; 

const BookingForm = () => {
    const { listingId } = useParams(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        guests: 1,
        fullName: '',
        phone: '',
        notes: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [listing, setListing] = useState({
        title: 'Beautiful Mountain Retreat',
        price: 1500, 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.fromDate) errors.fromDate = 'Please select a check-in date.';
        if (!formData.toDate) errors.toDate = 'Please select a check-out date.';
        if (formData.fromDate && formData.toDate && new Date(formData.fromDate) >= new Date(formData.toDate)) {
            errors.toDate = 'Check-out date must be after check-in date.';
        }
        if (formData.guests < 1 || formData.guests > 16) errors.guests = 'Enter number of guests (1–16).';
        if (!formData.fullName) errors.fullName = 'Full name is required.';
        if (!formData.phone || !/^\+?\d{10,15}$/.test(formData.phone)) errors.phone = 'Valid phone number is required.';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError(null);

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            const checkIn = new Date(formData.fromDate);
            const checkOut = new Date(formData.toDate);
            const diffTime = Math.abs(checkOut - checkIn);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const calculatedTotalPrice = listing.price * (diffDays > 0 ? diffDays : 1);

            console.log("Booking data to be sent:", { ...formData, listingId, calculatedTotalPrice });
            navigate('/payment');

        } catch (error) {
            console.error('Booking submission error:', error);
            setSubmissionError('Failed to process booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container my-5 d-flex justify-content-center">
            <div className="col-lg-8">
                <h2 className="mb-4 fw-semibold">
                    <span className="reserve">Reserve</span>
                    <span className="text-primary">{listing.title}</span>
                </h2>

                <form className="booking-form-custom p-4 rounded shadow needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="fromDate" className="form-label">Check-In</label>
                            <input
                                type="date"
                                className={`form-control ${formErrors.fromDate ? 'is-invalid' : ''}`}
                                id="fromDate"
                                name="fromDate"
                                value={formData.fromDate}
                                onChange={handleChange}
                                required
                                autocomplete="off"
                            />
                            {formErrors.fromDate && <div className="invalid-feedback">{formErrors.fromDate}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="toDate" className="form-label">Check-Out</label>
                            <input
                                type="date"
                                className={`form-control ${formErrors.toDate ? 'is-invalid' : ''}`}
                                id="toDate"
                                name="toDate"
                                value={formData.toDate}
                                onChange={handleChange}
                                required
                                autocomplete="off" 
                            />
                            {formErrors.toDate && <div className="invalid-feedback">{formErrors.toDate}</div>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="guests" className="form-label">Guests</label>
                            <input
                                type="number"
                                className={`form-control ${formErrors.guests ? 'is-invalid' : ''}`}
                                id="guests"
                                name="guests"
                                min="1"
                                max="16"
                                value={formData.guests}
                                onChange={handleChange}
                                required
                                autocomplete="off" 
                            />
                            {formErrors.guests && <div className="invalid-feedback">{formErrors.guests}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input
                                type="text"
                                className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                autocomplete="name" 
                            />
                            {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91 98765 43210"
                            autocomplete="tel" 
                        />
                        {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="notes" className="form-label">Special Requests (Optional)</label>
                        <textarea
                            className="form-control"
                            id="notes"
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Let the host know anything important..."
                            autocomplete="off" 
                        ></textarea>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;