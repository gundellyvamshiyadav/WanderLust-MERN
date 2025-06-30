import React from 'react';
import { Link } from 'react-router-dom';

const DashboardHeader = ({ user, userHasListings }) => {
    const getInitials = (name) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="dashboard-header">
            {user.profilePicture ? (
                <img src={user.profilePicture} alt="User Avatar" className="img-fluid rounded-circle avatar-lg" />
            ) : (
                <div className="rounded-circle avatar-lg d-flex align-items-center justify-content-center">
                    {getInitials(user.username)}
                </div>
            )}
            <div className="user-info">
                <h2>Hello, {user.username}!</h2>
                <p className="text-muted">{user.email}</p>
                {user.phone && <p className="text-muted mb-0"><i className="bi bi-telephone-fill me-1"></i> {user.phone}</p>}
            </div>
            <div className="action-buttons">
                {userHasListings ? (
                    <>
                        <Link to="/listings/new" className="btn btn-success"><i className="bi bi-plus-circle-fill me-2"></i> New Listing</Link>
                        <Link to="/listings" className="btn btn-outline-primary"><i className="bi bi-house-door-fill me-2"></i> Manage Listings</Link>
                    </>
                ) : (
                    <>
                        <Link to="/listings" className="btn btn-primary"><i className="bi bi-compass-fill me-2"></i> Explore</Link>
                        <Link to="/listings/new" className="btn btn-outline-success"><i className="bi bi-house-add-fill me-2"></i> Become a Host</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;