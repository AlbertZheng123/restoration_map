import React, { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css"; 
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { EditControl } from "react-leaflet-draw";
import { MapContainer, FeatureGroup, Polygon, Marker, TileLayer, useMapEvents } from 'react-leaflet';  // <-- Make sure to import useMapEvents
import { useNavigate } from 'react-router-dom';

// Include Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxAccessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;

function MapInteractionHandler({ isPlantModeActive, onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (isPlantModeActive) {
        onMapClick(e);
      }
    },
  });

  return null;
}

export default function MapComponent({ onSavePolygon, savedPolygon, isPolygonDisplayed, plantMarkers = [], onSavePlantMarkers, isPlantModeActive }) {
  const featureGroupRef = useRef(null);
  const [localPlantMarkers, setLocalPlantMarkers] = useState(plantMarkers);
  const navigate = useNavigate();  // For navigation

  useEffect(() => {
    setLocalPlantMarkers(plantMarkers);
  }, [plantMarkers]);

  const plantIcon = new L.Icon({
    iconUrl: '/plant_clip_art.jpg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs();
    onSavePolygon(latlngs[0]);
  };

  const handleMapClick = (e) => {
    const newMarker = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    };
    const updatedMarkers = [...localPlantMarkers, newMarker];
    setLocalPlantMarkers(updatedMarkers);
    onSavePlantMarkers(updatedMarkers);
  };

  // Function to save polygon WITHOUT markers and redirect to Polygon Plot Page
  const savePolygonWithoutMarkersAndRedirect = () => {
    try {
      let existingPolygons = localStorage.getItem('savedPolygonData');
      existingPolygons = existingPolygons ? JSON.parse(existingPolygons) : [];

      if (!Array.isArray(existingPolygons)) {
        existingPolygons = [];
      }

      const polygonWithoutMarkers = {
        type: 'polygon_with_inner_polygons',  // This polygon is for inner polygons
        mainPolygon: savedPolygon,  
        innerPolygons: [],  // Initialize with no inner polygons
      };

      existingPolygons.push(polygonWithoutMarkers);

      localStorage.setItem('savedPolygonData', JSON.stringify(existingPolygons));

      console.log('Polygon without markers saved!', polygonWithoutMarkers); // For debugging
      alert('Polygon without markers saved! Now plot inner polygons.');

      // Redirect to the Polygon Plot page
      navigate('/polygon-plot', { state: { polygon: savedPolygon } });
    } catch (error) {
      console.error("Error saving polygon without markers:", error);
    }
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer 
        center={[34.4269, -118.5754]} 
        zoom={20} 
        maxZoom={22}
        style={{ height: "100%", width: "100%" }}
      >
        <MapInteractionHandler 
          isPlantModeActive={isPlantModeActive} 
          onMapClick={handleMapClick}
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
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
          maxZoom={22}
          tileSize={512}
          zoomOffset={-1}
        />

        {isPolygonDisplayed && savedPolygon && (
          <Polygon positions={savedPolygon} color="blue" />
        )}

        {localPlantMarkers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.lat, marker.lng]} 
            icon={plantIcon}
          />
        ))}
      </MapContainer>

      {/* Add button to save polygon without markers and redirect */}
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={savePolygonWithoutMarkersAndRedirect}
          style={{ padding: '10px', backgroundColor: 'orange', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Plot Polygons Within
        </button>
      </div>
    </div>
  );
}
