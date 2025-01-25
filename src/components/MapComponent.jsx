import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ fleetData }) => {
    const zoomLevel = 0; // Adjust zoom level for better overview

    return (
        <div className="map-container -z-10 mt-20 rounded-lg">
            <MapContainer center={[20.5937, 78.9629]} zoom={zoomLevel} style={{ height: '500px', width: '100%' }}>
                <TileLayer className='-z-99'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {fleetData.map((vehicle) => (
                    <Marker key={vehicle.id} position={vehicle.coordinates}>
                        <Popup>
                            <strong>{vehicle.name}</strong><br />
                            {vehicle.description}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
