import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../components/Filters';
import ListingCard from '../components/ListingCard'; 

const ListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTax, setShowTax] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Trending'); 
    const [searchParams] = useSearchParams();

    const handleFilterChange = (newFilter) => {
        setActiveFilter(newFilter);
    };

    const handleTaxToggle = () => {
    setShowTax(prevState => {
        const newState = !prevState;
        console.log('ListingsPage: showTax state is changing to:', newState);
        return newState;
    });
};

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            const searchTerm = searchParams.get('search');
            const category = activeFilter;
            const query = new URLSearchParams();
            if (searchTerm) query.append('search', searchTerm);
            if (category && category !== 'Trending') query.append('category', category);
            
            try {
                const response = await fetch(`/api/listings?${query.toString()}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setListings(data);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, [activeFilter, searchParams]);

    const renderListings = () => {
        if (isLoading) {
            return (
                <div className="col-12 text-center mt-5">
                    <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
            );
        }

        if (listings.length === 0) {
            return (
                <div className="col-12 text-center mt-5">
                    <h4>No Exact Matches Found!</h4>
                    <p className="text-muted">Try changing your search or selecting a different category.</p>
                </div>
            );
        }

        return listings.map((listing) => (
            <div className="col" key={listing._id}>
                <ListingCard
                    listing={listing}
                    showTax={showTax} 
                />
            </div>
        ));
    };

    return (
        <>
            <Filters
                showTax={showTax}
                onTaxToggle={handleTaxToggle} 
                onFilterChange={handleFilterChange}
                activeFilter={activeFilter}
            />
            <div className="container-fluid">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mt-1">
                    {renderListings()}
                </div>
            </div>
        </>
    );
};

export default ListingsPage;