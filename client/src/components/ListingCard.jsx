import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing, showTax }) => {
    if (!listing || !listing.image) {
        return null; 
    }
    const taxStyle = {
        display: showTax ? 'inline' : 'none'
    };

    return (
        <Link to={`/listings/${listing._id}`} className="listing-anchor">
            <div className="card">
                <img 
                    src={listing.image.url} 
                    className="card-img-top" 
                    alt={listing.title} 
                    style={{ height: '20rem' }} 
                />
                <div className="card-img-overlay"></div>
                <div className="card-body tpart">
                    <b>{listing.title}</b>
                    <p>
                        ₹ {listing.price.toLocaleString("en-IN")} /night
                        <i className="tax-info" style={taxStyle}>
                            +18% GST
                        </i>
                    </p>  
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;