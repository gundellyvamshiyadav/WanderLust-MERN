import React from 'react';
import { Link } from 'react-router-dom';

const GuestBookingsTable = ({ bookings }) => {
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const handleCancel = async (bookingId) => {
        if(window.confirm('Are you sure you want to cancel this booking?')) {
            console.log('Cancelling booking', bookingId);
        }
    }

    return (
        <div className="card dashboard-table-card">
            <div className="card-header bg-light-subtle">
                <h5 className="mb-0">My Bookings</h5>
            </div>
            <div className="card-body p-0">
                {bookings.length === 0 ? (
                    <p className="text-muted text-center py-4">You have no bookings yet.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr><th>Listing</th><th>Check-in</th><th>Check-out</th><th>Guests</th><th>Total</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td><Link to={`/listings/${booking.listing?._id}`}>{booking.listing?.title || 'Deleted Listing'}</Link></td>
                                        <td>{formatDate(booking.fromDate)}</td>
                                        <td>{formatDate(booking.toDate)}</td>
                                        <td>{booking.guests}</td>
                                        <td>₹{booking.totalPrice.toLocaleString('en-IN')}</td>
                                        <td><span className={`badge rounded-pill text-bg-${booking.status.includes('Book') ? 'success' : 'warning'}`}>{booking.status}</span></td>
                                        <td>
                                            {booking.status === 'Booked' && <button onClick={() => handleCancel(booking._id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-x-lg"></i></button>}
                                            <Link to={`/bookings/${booking._id}/invoice`} className="btn btn-sm btn-outline-info ms-1"><i className="bi bi-file-earmark-arrow-down-fill"></i></Link>
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

export default GuestBookingsTable;