import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import apiClient from '../api';

const ContactHostPage = () => {
    const { id: listingId } = useParams();
    const navigate = useNavigate();
    const { curUser } = useAuth();
    const { addNotification } = useNotification();
    
    const [listing, setListing] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (!curUser) return; 
        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const data = await apiClient(`/listings/${listingId}`);
                setListing(data);
            } catch (err) {
                addNotification(err.message, 'error');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };
        fetchListing();
    }, [listingId, curUser, navigate, addNotification]);

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient(`/listings/${listingId}/contact`, {
                method: 'POST',
                body: JSON.stringify({ message }),
            });
            addNotification("Your message has been sent to the host!", 'success');
            setMessage("");
            navigate(`/listings/${listingId}`);
        } catch (err) {
            addNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
  
    if (!curUser) {
        return (
            <div className="container text-center mt-5">
                <h3>Contact Host</h3>
                <p>You must be logged in to contact a host.</p>
                <Link to={`/login`} state={{ from: { pathname: `/listings/${listingId}/contact` } }} className="btn btn-primary">
                    Login to Continue
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" /></div>;
    }

    if (!listing) {
        return <p className="text-center mt-5">Loading listing details...</p>;
    }

    return (
        <div className="form-card col-lg-8 offset-lg-2">
            <div className="text-center mb-4">
                <h3>Contact the Host</h3>
                <p className="text-muted">Ask a question about this listing or your potential stay.</p>
                <div className="mt-3">
                    <p className="mb-0">
                        Inquiring about: <strong><Link to={`/listings/${listingId}`} className="text-decoration-none">{listing.title}</Link></strong>
                    </p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">Your Name</label>
                        <input type="text" className="form-control" id="name" name="name" value={curUser.username} required readOnly />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Your Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={curUser.email} required readOnly />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="message" className="form-label">Your Message</label>
                    <textarea 
                        className="form-control" 
                        id="message" 
                        name="message" 
                        rows="6" 
                        placeholder={`Hi ${listing.owner.username}, I have a question about...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                    <div className="invalid-feedback">Please write your message.</div>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-dark w-50" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send to Host'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactHostPage;