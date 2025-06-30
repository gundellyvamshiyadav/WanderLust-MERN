import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


const Map = ({ coordinates, title }) => {
  if (!coordinates || coordinates.length !== 2) {
    return <div style={{height: '400px'}} className="d-flex align-items-center justify-content-center"><p className="text-danger">⚠ Location data is missing.</p></div>;
  }

  const [longitude, latitude] = coordinates;
  const position = [latitude, longitude];

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <b>{title}</b>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;