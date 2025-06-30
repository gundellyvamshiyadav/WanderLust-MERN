//Street view
function initMap(latitude, longitude, title = "Unknown Listing") {
    console.log("initMap called with:", { latitude, longitude, title });
    
    if (typeof L === 'undefined') {
        console.error("Leaflet (L) is not defined. Ensure Leaflet JS is loaded.");
        return;
    }

    try {
        const map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`<h4>${title}</h4>`)
            .openPopup();
    } catch (error) {
        console.error("Error in initMap:", error);
    }
}


//**************************************for satellite view of map**************
/* function initMap(latitude, longitude, title = "Unknown Listing") {
    console.log("initMap called with:", { latitude, longitude, title });
    
    if (typeof L === 'undefined') {
        console.error("Leaflet (L) is not defined. Ensure Leaflet JS is loaded.");
        return;
    }

    try {
        const map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 18
        }).addTo(map);
        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`<h6>${title}</h6>`)
            .openPopup();
    } catch (error) {
        console.error("Error in initMap:", error);
    }
} */