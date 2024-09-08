import React, { useRef } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { EditControl } from "react-leaflet-draw";
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';

export default function MapComponent({ onSavePolygon, savedPolygon, isPolygonDisplayed }) {

  const featureGroupRef = useRef(null);

  const handleCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs(); // Correctly access the coordinates
    console.log('Polygon created with these points (full structure):', latlngs); // Log the full structure
  
    // Save the first set of lat/lng points (outer polygon ring)
    onSavePolygon(latlngs[0]); // Pass the outermost polygon
  };

  return (
    <MapContainer center={[34.4269, -118.5754]} zoom={20} style={{ height: "100%", width: "100%" }}>
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position='topright'
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              drawError: {
                color: '#e1e100',
                message: "<strong>Oh snap!<strong> you can't draw that!"
              },
              shapeOptions: {
                color: '#bada55'
              }
            },
          }}
        />
      </FeatureGroup>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Display the saved polygon if isPolygonDisplayed is true */}
      {isPolygonDisplayed && savedPolygon && (
        <Polygon positions={savedPolygon} color="blue" />
      )}
    </MapContainer>
  );
}
