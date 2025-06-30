import React from 'react';
import { Link } from 'react-router-dom';

const HostBookingsTable = ({ bookings }) => {
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const getStatusBadge = (status) => {
        if (status.toLowerCase().includes('book')) return 'success';
        if (status.toLowerCase().includes('pend')) return 'warning';
        if (status.toLowerCase().includes('cancel')) return 'danger';
        return 'secondary';
    };

    return (
        <div className="card dashboard-table-card">
            <div className="card-header bg-light-subtle d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Bookings on Your Listings</h5>
            </div>
            <div className="card-body p-0">
                {bookings.length === 0 ? (
                    <p className="text-muted text-center py-4 px-3">No bookings received yet. Share your listings to attract guests!</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Guest</th>
                                    <th>Listing</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td>{booking.user?.username || 'N/A'}</td>
                                        <td><Link to={`/listings/${booking.listing?._id}`}>{booking.listing?.title || 'Deleted Listing'}</Link></td>
                                        <td>{formatDate(booking.fromDate)}</td>
                                        <td>{formatDate(booking.toDate)}</td>
                                        <td>₹{booking.totalPrice.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`badge rounded-pill text-bg-${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostBookingsTable;