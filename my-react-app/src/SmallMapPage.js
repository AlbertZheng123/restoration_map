import React, { useState } from 'react';
import SmallMap from './SmallMap'; // Import the small map component

export default function SmallMapPage({ savedPolygon, plantMarkers, onSavePlantMarkers }) {
  const [isPlantModeActive, setIsPlantModeActive] = useState(false); // State to toggle plant mode
  const [savedPolygons, setSavedPolygons] = useState([]); // State to hold saved polygons

  const togglePlantMode = () => {
    setIsPlantModeActive(!isPlantModeActive); // Toggle plant mode on and off
    console.log("Plant Mode toggled. Current status:", !isPlantModeActive ? 'Active' : 'Inactive');
  };

  const handleSavePolygon = () => {
    const newSavedPolygon = {
      polygon: savedPolygon,
      markers: plantMarkers,
    };
  
    // Retrieve any previously saved polygons from localStorage
    const existingPolygons = JSON.parse(localStorage.getItem('savedPolygons')) || [];
  
    // Add the new polygon to the array
    const updatedPolygons = [...existingPolygons, newSavedPolygon];
  
    // Save the updated array back to localStorage
    localStorage.setItem('savedPolygons', JSON.stringify(updatedPolygons));
  
    setSavedPolygons(updatedPolygons); // Update the local state
    alert('Polygon and markers saved!');
  };
  

  return (
    <div className="polygon-page">
      <header>
        <h1>Polygon Focus Map</h1>
      </header>
      <div className="small-map-container">
        {/* Button to toggle plant mode */}
        <button onClick={togglePlantMode}>
          {isPlantModeActive ? 'Deactivate Plant Mode' : 'Activate Plant Mode'}
        </button>

        {/* Render the small map with the polygon and plant-plotting functionality */}
        <SmallMap 
          savedPolygon={savedPolygon} 
          isPlantModeActive={isPlantModeActive} 
          plantMarkers={plantMarkers} 
          onSavePlantMarkers={onSavePlantMarkers} 
        />

        {/* Button to Save Polygon and Markers */}
        <button onClick={handleSavePolygon}>Save Polygon and Markers</button>
      </div>
    </div>
  );
}
