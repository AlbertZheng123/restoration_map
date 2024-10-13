import React, { useState } from 'react';
import MapComponent from './MapView';
import { useNavigate } from 'react-router-dom';

export default function Home({ savedPolygon, setSavedPolygon }) {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [isPolygonDisplayed, setIsPolygonDisplayed] = useState(false); // State to handle polygon display
  const [plantMarkers, setPlantMarkers] = useState([]); // Global state to store plant marker positions

  // Function to save the polygon coordinates
  const handleSavePolygon = (polygonCoords) => {
    console.log("Polygon coordinates saved:", polygonCoords);
    setSavedPolygon(polygonCoords); // Save the polygon coordinates to the parent state
  };

  // Function to save plant markers
  const handleSavePlantMarkers = (markers) => {
    setPlantMarkers(markers); // Save plant marker positions globally
  };

  // Function to navigate to the polygon page
  const handleDisplayPolygon = () => {
    if (savedPolygon) {
      console.log("Displaying saved polygon:", savedPolygon);
      setIsPolygonDisplayed(true); // Display the polygon on the main map (if needed)
      navigate('/polygon'); // Redirect to the Polygon Page
    } else {
      alert("No polygon has been saved yet!");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li>Overview</li>
          <li>Plants</li>
          <li>Regions</li>
          <li onClick={() => navigate('/impact')}>Impact</li>  {/* Navigate to the Impact page */}
          <li onClick={() => navigate('/plant-database')}>Plant Database</li>
          {/* New button for Saved Polygons */}
          <li onClick={() => navigate('/saved-polygons')}>View Saved Polygons</li>
        </ul>
        {/* Button to display the saved polygon */}
        <button onClick={handleDisplayPolygon}>Display Saved Polygon</button>
      </div>
      <div className="main-content">
        <h2>Mapping Restoration Efforts</h2>
        <div className="map-container">
          {/* Main map component */}
          <MapComponent 
            onSavePolygon={handleSavePolygon} 
            isPolygonDisplayed={isPolygonDisplayed} 
            savedPolygon={savedPolygon} 
            onSavePlantMarkers={handleSavePlantMarkers} 
            plantMarkers={plantMarkers}
            isPlantModeActive={false} // Plant mode deactivated for the big map
          />
        </div>
      </div>
    </div>
  );
}
