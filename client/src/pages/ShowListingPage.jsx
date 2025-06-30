import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Map from '../components/Map';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const ShowListingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { curUser } = useAuth();
    const { addNotification } = useNotification();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchListing = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/listings/${id}`);
                if (!response.ok) throw new Error('Listing not found');
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
    }, [id, addNotification, navigate]);

    const handleDeleteListing = async () => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                const response = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete listing');
                addNotification('Listing deleted successfully!', 'success');
                navigate('/listings');
            } catch (err) {
                addNotification(err.message, 'error');
            }
        }
    };

    const handleReviewSubmitted = (newReview) => {
        setListing(prev => ({...prev, reviews: [...prev.reviews, newReview]}));
    };

    const handleReviewDeleted = (deletedReviewId) => {
        setListing(prev => ({...prev, reviews: prev.reviews.filter(r => r._id !== deletedReviewId)}));
    };
    
    if (isLoading) {
        return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" /></div>;
    }
    if (!listing) {
        return <p className="text-center mt-5">Listing could not be loaded.</p>;
    }
    
    const isOwner = curUser && listing.owner && curUser._id === listing.owner._id;

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2">
                    <h3>{listing.title}</h3>
                </div>
                <div className="col-12 col-sm-10 col-md-8 col-lg-8 offset-md-2">
                    <img src={listing.image.url} className="card-img-top showpageimage" alt={listing.title} style={{height: 'auto', maxHeight: '55vh', objectFit: 'cover'}} />
                    <div className="card-body">
                        <p className="card-text">Owned By {listing.owner.username}</p>
                        <p className="card-text">{listing.description}</p>
                        <p className="card-text">₹ {listing.price.toLocaleString("en-IN")}</p>
                        <p className="card-text">{listing.location}</p>
                        <p className="card-text">{listing.country}</p>
                    </div>
                </div>

                <div className="col-12 col-md-8 offset-md-2 d-flex justify-content-start gap-3 mb-3 mt-3">
                    {isOwner ? (
                        <>
                            <Link className="btn btn-dark btn-a" to={`/listings/${listing._id}/edit`}>EDIT</Link>
                            <button onClick={handleDeleteListing} className="btn btn-dark btn-d">DELETE</button>
                        </>
                    ) : curUser ? (
                        <>
                            <Link to={`/bookings/${listing._id}/book`} className="btn btn-success">Book Now</Link>
                            <Link to={`/listings/${listing._id}/contact`} className="btn btn-outline-secondary ms-3">
                                Contact Host
                            </Link>
                        </>
                    ) : (
                        <div className="d-flex justify-content-center w-100">
                             <Link to="/login" className="btn btn-success">Login to Book</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Review and Map Section */}
            <div className="col-8 offset-2 mt-3">
                {curUser && (
                    <ReviewForm listingId={listing._id} onReviewSubmit={handleReviewSubmitted} />
                )}
                
                <ReviewList 
                    reviews={listing.reviews} 
                    listingId={listing._id}
                    onReviewDelete={handleReviewDeleted}
                />

                <h3 className="maptitle">Where you'll be</h3>
                <div id="map" style={{ height: '400px', width: '100%' }}>
                    <Map coordinates={listing.geometry?.coordinates} title={listing.title} />
                </div>
            </div>
        </>
    );
};

export default ShowListingPage;