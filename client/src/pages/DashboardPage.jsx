import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MetricCard from '../components/dashboard/MetricCard';
import HostBookingsTable from '../components/dashboard/HostBookingsTable';
import GuestBookingsTable from '../components/dashboard/GuestBookingsTable';
import EarningsChart from '../components/dashboard/EarningsChart';
import StatusPieChart from '../components/dashboard/StatusPieChart';
import { Link } from 'react-router-dom';

const DashboardPage = ({ curUser }) => { 
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await fetch('/api/dashboard');
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Could not fetch dashboard data.');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []); 

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }
    
    if (!data) return null; 

    const { user, userHasListings, bookings, totalListings, totalReceivedBookings, totalEarnings, chartData } = data;

    return (
        <div className="dashboard-wrapper">
            <DashboardHeader user={user} userHasListings={userHasListings} />
            
            <h1 className="mb-4 dashboard-main-title">
                {userHasListings ? (
                    <><i className="bi bi-bar-chart-line-fill me-2"></i> Host Dashboard Overview</>
                ) : (
                    <><i className="bi bi-person-fill me-2"></i> My Bookings</>
                )}
            </h1>
            <hr className="mb-4" />

            {userHasListings ? (
                <>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
                        <MetricCard title="Total Listings" value={totalListings} icon="house-door-fill" text="Properties You Host" />
                        <MetricCard title="Total Bookings" value={totalReceivedBookings} icon="calendar-check-fill" text="Guest Reservations" />
                        <MetricCard title="Total Earnings" value={`₹${totalEarnings.toLocaleString('en-IN')}`} icon="cash-stack" text="Revenue Generated" />
                    </div>
                    <div className="row g-4 mb-4">
                        <div className="col-lg-6">
                            <EarningsChart chartData={chartData.monthlyEarnings} />
                        </div>
                        <div className="col-lg-6">
                            <StatusPieChart chartData={chartData.bookingStatus} />
                        </div>
                    </div>
                    <HostBookingsTable bookings={bookings} />
                </>
            ) : (
                <>
                    <GuestBookingsTable bookings={bookings} />
                    <div className="card dashboard-cta-card mt-4">
                        <div className="card-body text-center">
                            <h5 className="card-title mb-3 mt-2">We're here to help!</h5>
                            <p className="card-text text-muted">Get in touch for any queries regarding your bookings.</p>
                            <Link to="/support" className="btn btn-primary mb-3">
                                <i className="bi bi-chat-dots-fill me-2"></i> Get in Touch
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;