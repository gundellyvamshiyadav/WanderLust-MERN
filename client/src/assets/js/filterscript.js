document.addEventListener('DOMContentLoaded', () => {
    console.log('Filter script loaded at:', new Date().toISOString());

    const filtersContainer = document.querySelector('.filters');
    const navLeft = document.querySelector('.filter-nav-left');
    const navRight = document.querySelector('.filter-nav-right');

    if (!filtersContainer || !navLeft || !navRight) {
        console.log('Filter elements not found; skipping filter script execution');
        return;
    }

    const updateScrollState = () => {
        const scrollWidth = filtersContainer.scrollWidth;
        const clientWidth = filtersContainer.clientWidth;
        const scrollLeft = filtersContainer.scrollLeft;
        console.log(`Filters: scrollWidth=${scrollWidth}px, clientWidth=${clientWidth}px, scrollLeft=${scrollLeft}px`);
        navLeft.style.display = scrollLeft > 0 ? 'flex' : 'none';
        navRight.style.display = scrollLeft < scrollWidth - clientWidth - 1 ? 'flex' : 'none';
        if (scrollWidth <= clientWidth) {
            console.warn('No scrolling needed');
            navLeft.style.display = 'none';
            navRight.style.display = 'none';
        }
    };

    updateScrollState();
    filtersContainer.addEventListener('scroll', updateScrollState);

    // Scroll left
    navLeft.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Scroll left clicked, scrollLeft:', filtersContainer.scrollLeft);
        const newScrollLeft = filtersContainer.scrollLeft - 100;
        filtersContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        console.log('Scrolled to:', newScrollLeft);
    });

    // Scroll right
    navRight.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Scroll right clicked, scrollLeft:', filtersContainer.scrollLeft);
        const newScrollLeft = filtersContainer.scrollLeft + 100;
        filtersContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        console.log('Scrolled to:', newScrollLeft);
    });

    // Filter selection
    const updateFilters = () => {
        const selectedFilters = {};
        document.querySelectorAll('.filter.active').forEach(filter => {
            const filterType = filter.getAttribute('data-filter');
            const filterValue = filter.getAttribute('data-value');
            if (!selectedFilters[filterType]) {
                selectedFilters[filterType] = [];
            }
            selectedFilters[filterType].push(filterValue);
        });

        const params = new URLSearchParams();
        Object.keys(selectedFilters).forEach(type => {
            if (type === 'amenities') {
                params.set(type, selectedFilters[type].join(','));
            } else {
                params.set(type, selectedFilters[type][0]); 
            }
        });

        const newUrl = `/listings?${params.toString()}`;
        console.log('Updating URL:', newUrl);
        window.location.href = newUrl;
    };

    // Toggle active filter
    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', () => {
            filter.classList.toggle('active');
            const filterType = filter.getAttribute('data-filter');
            const filterValue = filter.getAttribute('data-value');
            console.log(`Filter selected: ${filterType}=${filterValue}`);
            updateFilters();
        });
    });
});