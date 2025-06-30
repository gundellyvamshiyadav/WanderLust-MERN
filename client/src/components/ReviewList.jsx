import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ReviewList = ({ reviews, listingId, onReviewDelete }) => {
    const { curUser } = useAuth();
    const { addNotification } = useNotification();

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            const response = await fetch(`/api/listings/${listingId}/reviews/${reviewId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete review.');
            }
            addNotification('Review Deleted!', 'success');
            onReviewDelete(reviewId); 
        } catch (err) {
            addNotification(err.message, 'error');
        }
    };

    return (
        <div className="row aa">
            {reviews && reviews.length > 0 && (
                <p><b>All Reviews</b></p>
            )}
            {reviews.map((review) => (
                <div className="card review-card mb-3 col-12 col-md-5" key={review._id}>
                    <div className="card-body">
                        <h5 className="card-title text-truncate">@{review.author.username}</h5>
                        <p className="starability-result card-text" data-rating={review.rating}></p>
                        <p className="card-text text-wrap">💬 {review.comment}</p>
                    </div>
                    {curUser && curUser._id === review.author._id && (
                        <button onClick={() => handleDelete(review._id)} className="btn btn-sm btn-dark mb-2 mt-2" style={{marginLeft: '1rem'}}>
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;