import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import Filters from '../components/Filters';
import { useNotification } from '../context/NotificationContext';
import apiClient from '../api';

const ListingsIndexPage = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('');
    const [showTax, setShowTax] = useState(true); 

    const { addNotification } = useNotification();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (activeFilter) params.append('category', activeFilter);
                if (searchQuery) params.append('search', searchQuery);

                const data = await apiClient(`/listings?${params.toString()}`);
                setListings(data);
            } catch (err) {
                setError(err.message);
                addNotification(err.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, [activeFilter, searchQuery, addNotification]);

    const handleTaxToggle = () => {
        setShowTax(currentValue => !currentValue);
    };
    const handleFilterChange = (newFilter) => {
        setActiveFilter(currentFilter => (currentFilter === newFilter ? '' : newFilter));
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="d-flex justify-content-center mt-5">
                    <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }
        if (error) return <p className="text-center text-danger mt-5">Error: {error}</p>;
        if (listings.length === 0) return <p className="text-muted mt-5">No listings found.</p>;

        return (
            <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-3">
                {listings.map(listing => (
                    <ListingCard 
                        key={listing._id} 
                        listing={listing} 
                        showTax={showTax} 
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <Filters 
                showTax={showTax}                 
                onTaxToggle={handleTaxToggle}    
                activeFilter={activeFilter}       
                onFilterChange={handleFilterChange} 
            />
            {renderContent()}
        </>
    );
};

export default ListingsIndexPage;