import React, { useState } from 'react';
import SmallMap from './SmallMap'; // Import the small map component
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To handle redirection

export default function SmallMapPage({ savedPolygon, plantMarkers, onSavePlantMarkers }) {
  const [isPlantModeActive, setIsPlantModeActive] = useState(false); // State to toggle plant mode
  const navigate = useNavigate(); // For redirecting after button click

  const togglePlantMode = () => {
    setIsPlantModeActive(!isPlantModeActive); // Toggle plant mode on and off
    console.log("Plant Mode toggled. Current status:", !isPlantModeActive ? 'Active' : 'Inactive');
  };

  const isValidLatLng = (lat, lng) => {
    const isValid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
    return isValid;
  };

  const formatBoundaries = (polygon) => {
    return polygon.map(point => {
      if (isValidLatLng(point.lat, point.lng)) {
        return [point.lat, point.lng];
      }
      return null;
    }).filter(Boolean);
  };

  const formatPlants = (markers) => {
    return markers.map(marker => {
      if (isValidLatLng(marker.lat, marker.lng)) {
        return [marker.lat, marker.lng];
      }
      return null;
    }).filter(Boolean);
  };

  // Function to save polygon and marker data to localStorage
  const savePolygonWithMarkers = () => {
    try {
      let existingPolygons = localStorage.getItem('savedPolygonData');
      existingPolygons = existingPolygons ? JSON.parse(existingPolygons) : [];

      if (!Array.isArray(existingPolygons)) {
        existingPolygons = [];
      }

      const polygonWithMarkers = {
        type: 'polygon_with_markers',  // Identifier for marker polygons
        polygon: savedPolygon,
        markers: plantMarkers,
      };

      localStorage.setItem('savedPolygonData', JSON.stringify([...existingPolygons, polygonWithMarkers]));

      console.log('Polygon with markers saved!', polygonWithMarkers);
      alert('Polygon with markers saved!');
    } catch (error) {
      console.error("Error saving polygon with markers:", error);
    }
  };

  const handleSavePolygonAndRedirect = () => {
    const formattedBoundaries = formatBoundaries(savedPolygon);
    const formattedPlants = formatPlants(plantMarkers);

    const newSavedPolygon = {
      boundaries: formattedBoundaries,
      plants: formattedPlants,
      save: true,
      interpolation: true,
      time: 70,
      epsilon: 1e-2,
      kappa: 1.0,
      D: 1.2,
    };

    axios.post('http://localhost:8000/api/predict-plant-growth/', newSavedPolygon)
      .then(response => {
        alert('Polygon and markers sent to backend successfully!');

        savePolygonWithMarkers(); // Save polygons with markers locally

        const { overlayImageURL } = response.data;
        navigate('/biomass-overlay', { state: { imageURL: overlayImageURL, polygon: formattedBoundaries } });
      })
      .catch(error => {
        console.error("Error submitting polygon and markers to backend:", error);
        alert('Failed to send data to the backend.');
      });
  };

  return (
    <div className="polygon-page">
      <header>
        <h1>Polygon Focus Map</h1>
      </header>

      {/* Map Container */}
      <div className="small-map-container" style={{ height: '500px', width: '100%' }}>
        <button 
          onClick={togglePlantMode} 
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}
        >
          {isPlantModeActive ? 'Deactivate Plant Mode' : 'Activate Plant Mode'}
        </button>

        <SmallMap 
          savedPolygon={savedPolygon.filter(point => point && isValidLatLng(point.lat, point.lng))}  
          isPlantModeActive={isPlantModeActive} 
          plantMarkers={plantMarkers.filter(marker => marker && isValidLatLng(marker.lat, marker.lng))}  
          onSavePlantMarkers={onSavePlantMarkers} 
        />
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={handleSavePolygonAndRedirect} 
          style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Save Polygon, Markers & View Biomass Overlay
        </button>
      </div>
    </div>
  );
}
