import React, { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";  // Ensure Leaflet CSS is imported
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { EditControl } from "react-leaflet-draw";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Marker, useMapEvents } from 'react-leaflet'; 

// Component to handle map interactions based on Plant Mode
function MapInteractionHandler({ isPlantModeActive, onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (isPlantModeActive) {
        onMapClick(e);
      }
    },
  });

  return null; // This component does not render anything
}

export default function MapComponent({ onSavePolygon, savedPolygon, isPolygonDisplayed, plantMarkers = [], onSavePlantMarkers, isPlantModeActive }) {
  const featureGroupRef = useRef(null);
  const [localPlantMarkers, setLocalPlantMarkers] = useState(plantMarkers);

  // Sync global plantMarkers with local state whenever props update
  useEffect(() => {
    setLocalPlantMarkers(plantMarkers);
  }, [plantMarkers]);

  // Custom plant icon (make sure the path is correct)
  const plantIcon = new L.Icon({
    iconUrl: '/plant_clip_art.jpg', // Path to your custom image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor the icon (base of the marker)
    popupAnchor: [0, -32], // Where the popup should open (relative to the icon)
  });

  // Handle polygon creation
  const handleCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs();
    console.log('Polygon created with these points (full structure):', latlngs);
    onSavePolygon(latlngs[0]); // Pass the outermost polygon
  };

  // Handle map clicks to place a plant marker if plant mode is active
  const handleMapClick = (e) => {
    console.log("Map clicked at coordinates: ", e.latlng);

    const newMarker = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    };

    const updatedMarkers = [...localPlantMarkers, newMarker];
    setLocalPlantMarkers(updatedMarkers); // Update local markers state
    onSavePlantMarkers(updatedMarkers); // Save the updated markers globally

    console.log("New marker placed at: ", newMarker);
  };

  return (
    <div style={{ height: '500px', width: '100%' }}> {/* Make sure the container has a height */}
      <MapContainer 
        center={[34.4269, -118.5754]} 
        zoom={20} 
        style={{ height: "100%", width: "100%" }} // Map needs to have height and width
      >
        <MapInteractionHandler 
          isPlantModeActive={isPlantModeActive} 
          onMapClick={handleMapClick} // Pass map click handler to the interaction handler
        />

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

        {isPolygonDisplayed && savedPolygon && (
          <Polygon positions={savedPolygon} color="blue" />
        )}

        {/* Use custom plant icon for each marker */}
        {localPlantMarkers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.lat, marker.lng]} 
            icon={plantIcon} // Apply the custom icon
          />
        ))}
      </MapContainer>
    </div>
  );
}

