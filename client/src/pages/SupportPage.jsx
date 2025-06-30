import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import apiClient from '../api'; 

const subjectOptions = [
  "General Inquiry",
  "Booking Question",
  "Refund Request",
  "Technical Issue",
  "Feedback & Suggestions"
];

const SupportPage = () => {
    const { curUser } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setIsSubmitting(true);
        const payload = {
            name: curUser.username,
            email: curUser.email,
            subject: formData.subject,
            message: formData.message,
        };

        try {
            await apiClient('/contact', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            addNotification("Your request has been submitted successfully!", 'success');
            setFormData({ subject: "", message: "" });
            navigate('/dashboard');
        } catch (err) {
            addNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!curUser) {
        return (
            <div className="container text-center mt-5">
                <h3>Contact Support</h3>
                <p>You must be logged in to contact support.</p>
                <Link to="/login" state={{ from: { pathname: '/support' } }} className="btn btn-primary">
                    Login to Continue
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="form-card col-lg-8 offset-lg-2">
                <div className="text-center mb-4">
                    <h3>Contact Wanderlust Support</h3>
                    <p className="text-muted">For general questions, refund requests, or technical issues, please fill out the form below.</p>
                </div>
                <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="name" className="form-label">Your Name</label>
                            <input type="text" className="form-control" id="name" value={curUser.username} required readOnly />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Your Email</label>
                            <input type="email" className="form-control" id="email" value={curUser.email} required readOnly />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="subject" className="form-label">Subject</label>
                        <select className="form-select" id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
                            <option value="" disabled>-- Select a reason --</option>
                            {subjectOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Please select a subject.</div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea className="form-control" id="message" name="message" value={formData.message} onChange={handleChange} rows="6" placeholder="Please provide as much detail as possible..." required></textarea>
                        <div className="invalid-feedback">Please write your message.</div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-dark w-50" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupportPage;