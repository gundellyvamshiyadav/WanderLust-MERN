import React, { useRef, useState, useEffect } from 'react';

const filterOptions = [
    { name: 'Trending', icon: 'fa-solid fa-fire' }, { name: 'Rooms', icon: 'fa-solid fa-door-open' },
    { name: 'Iconic cities', icon: 'fa-solid fa-city' }, { name: 'Mountains', icon: 'fa-solid fa-mountain' },
    { name: 'Castles', icon: 'fa-solid fa-chess-rook' }, { name: 'Amazing pools', icon: 'fa-solid fa-swimming-pool' },
    { name: 'Camping', icon: 'fa-solid fa-campground' }, { name: 'Farms', icon: 'fa-solid fa-tractor' },
    { name: 'Arctic', icon: 'fa-solid fa-snowflake' }, { name: 'Domes', icon: 'fa-solid fa-globe' },
    { name: 'Boats', icon: 'fa-solid fa-anchor' }, { name: 'Lakes', icon: 'fa-solid fa-water' },
    { name: 'Tree city', icon: 'fa-solid fa-tree' }, { name: 'Beach', icon: 'fa-solid fa-umbrella-beach' },
    { name: 'Wineyards', icon: 'fa-solid fa-wine-glass' }, { name: 'Deserts', icon: 'fa-solid fa-sun' },
    { name: 'Islands', icon: 'fa-solid fa-umbrella-beach' }, { name: 'Urban', icon: 'fa-solid fa-building' },
    { name: 'Eco-friendly', icon: 'fa-solid fa-leaf' }, { name: 'Ski', icon: 'fa-solid fa-skiing' },
    { name: 'Historical', icon: 'fa-solid fa-landmark' }
];

const Filters = ({ showTax, onTaxToggle, onFilterChange, activeFilter }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
        const timer = setTimeout(() => checkScroll(), 100);
        container.addEventListener('scroll', checkScroll);
        return () => {
            clearTimeout(timer);
            container.removeEventListener('scroll', checkScroll);
        };
    }
  }, [filterOptions]); 

  const handleScroll = (offset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="filter-container">
      <div className="filters-wrapper">
        {showLeftArrow && (
          <button className="filter-nav filter-nav-left" onClick={() => handleScroll(-100)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}
        <div className="filters" ref={scrollContainerRef}>
          {filterOptions.map(filter => (
            <div key={filter.name} className={`filter ${activeFilter === filter.name ? 'active' : ''}`} onClick={() => onFilterChange(filter.name)}>
              <div><i className={filter.icon}></i></div>
              <p>{filter.name}</p>
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button className="filter-nav filter-nav-right" onClick={() => handleScroll(100)}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>

      <div className="tax-toggle">
        <div className="form-check-reverse form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckDefault"
            checked={showTax}
            onChange={onTaxToggle}
          />
          <label className="form-check-label" htmlFor="switchCheckDefault">
            {showTax ? "Total after taxes" : "Total before taxes"}
          </label>
        </div>
      </div>
    </div>
  );
};

export default Filters;