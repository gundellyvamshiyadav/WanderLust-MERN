import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import apiClient from '../api';

const ReviewForm = ({ listingId, onReviewSubmit }) => {
    const { addNotification } = useNotification();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);

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
            const data = await apiClient(`/listings/${listingId}/reviews`, {
                method: 'POST',
                body: JSON.stringify({ review: { rating, comment } }),
            });
            addNotification('Review submitted successfully!', 'success');
            onReviewSubmit(data);
            setComment("");
            setRating(5);
            setValidated(false); 
        } catch (err) {
            addNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <hr />
            <h3>Leave a Review</h3>
            <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
                <div className="mt-3 mb-3">
                    <label htmlFor="rating" className="form-label">Rating</label>
                    <fieldset className="starability-slot">
                        <input type="radio" id="no-rate" className="input-no-rate" name="rating" value="1" checked={rating === 1} onChange={() => setRating(1)} aria-label="No rating." />
                        <input type="radio" id="first-rate1" name="rating" value="1" checked={rating === 1} onChange={() => setRating(1)} />
                        <label htmlFor="first-rate1" title="Terrible">1 star</label>
                        <input type="radio" id="first-rate2" name="rating" value="2" checked={rating === 2} onChange={() => setRating(2)} />
                        <label htmlFor="first-rate2" title="Not good">2 stars</label>
                        <input type="radio" id="first-rate3" name="rating" value="3" checked={rating === 3} onChange={() => setRating(3)} />
                        <label htmlFor="first-rate3" title="Average">3 stars</label>
                        <input type="radio" id="first-rate4" name="rating" value="4" checked={rating === 4} onChange={() => setRating(4)} />
                        <label htmlFor="first-rate4" title="Very good">4 stars</label>
                        <input type="radio" id="first-rate5" name="rating" value="5" checked={rating === 5} onChange={() => setRating(5)} />
                        <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                    </fieldset>
                </div>
                <div className="mt-3 mb-3">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea 
                        name="comment" 
                        id="comment" 
                        cols="60" 
                        rows="4" 
                        placeholder="Leave your comment!" 
                        className="form-control" 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>   
                    <div className="invalid-feedback">Please enter a comment for the review.</div>
                </div>
                <button type="submit" className="btn btn-dark mb-3 btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                </button>
            </form>
        </>
    );
};

export default ReviewForm;