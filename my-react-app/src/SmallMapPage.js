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

  // Utility function to validate LatLng
  const isValidLatLng = (lat, lng) => {
    const isValid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
    if (!isValid) {
      console.warn(`Invalid LatLng detected: lat=${lat}, lng=${lng}`);  // Debugging Warning
    }
    return isValid;
  };

  const formatBoundaries = (polygon) => {
    console.log("Formatting Polygon Data:", polygon); // Debugging Log
    return polygon.map(point => {
      if (isValidLatLng(point.lat, point.lng)) {
        return [point.lat, point.lng];
      } else {
        console.warn("Invalid polygon point detected and ignored:", point); // Warn about invalid points
        return null; // Return null for invalid points
      }
    }).filter(Boolean); // Filter out null values
  };

  const formatPlants = (markers) => {
    console.log("Formatting Plant Markers:", markers); // Debugging Log
    return markers.map(marker => {
      if (isValidLatLng(marker.lat, marker.lng)) {
        return [marker.lat, marker.lng];
      } else {
        console.warn("Invalid marker detected and ignored:", marker); // Warn about invalid markers
        return null; // Return null for invalid markers
      }
    }).filter(Boolean); // Filter out null values
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
        console.log("Response from backend:", response.data);
        alert('Polygon and markers sent to backend successfully!');

        // Save the polygon data locally for Impact page use
        const existingPolygons = JSON.parse(localStorage.getItem('savedPolygons')) || [];
        existingPolygons.push({ polygon: formattedBoundaries, markers: formattedPlants });
        localStorage.setItem('savedPolygons', JSON.stringify(existingPolygons));

        // Redirect to the biomass overlay page
        const { overlayImageURL } = response.data;
        navigate('/biomass-overlay', { state: { imageURL: overlayImageURL, polygon: formattedBoundaries } });
      })
      .catch(error => {
        console.error("Error submitting polygon and markers to backend:", error);
        alert('Failed to send data to the backend. Check console for more details.');
      });
  };

  return (
    <div className="polygon-page">
      <header>
        <h1>Polygon Focus Map</h1>
      </header>

      {/* Map Container with Fixed Height */}
      <div className="small-map-container" style={{ height: '500px', width: '100%' }}>
        {/* Button to toggle plant mode */}
        <button 
          onClick={togglePlantMode} 
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}
        >
          {isPlantModeActive ? 'Deactivate Plant Mode' : 'Activate Plant Mode'}
        </button>

        {/* Render the small map with the polygon and plant-plotting functionality */}
        <SmallMap 
          savedPolygon={savedPolygon.filter(point => point && isValidLatLng(point.lat, point.lng))}  // Validate coordinates
          isPlantModeActive={isPlantModeActive} 
          plantMarkers={plantMarkers.filter(marker => marker && isValidLatLng(marker.lat, marker.lng))}  // Validate markers
          onSavePlantMarkers={onSavePlantMarkers} 
        />
      </div>

      {/* Button to Save Polygon and Markers - Positioned Below the Map */}
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
