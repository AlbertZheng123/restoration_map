import React, { useState } from 'react';
import './App.css';
import MapComponent from './MapView';

function App() {
  const [savedPolygon, setSavedPolygon] = useState(null); // State to store saved polygon coordinates
  const [isPolygonDisplayed, setIsPolygonDisplayed] = useState(false); // State to handle polygon display

  const handleSavePolygon = (polygonCoords) => {
    console.log("Polygon coordinates saved:", polygonCoords); // Debugging output
    setSavedPolygon(polygonCoords); // Save the polygon coordinates to the state
  };

  const handleDisplayPolygon = () => {
    if (savedPolygon) {
      console.log("Displaying saved polygon:", savedPolygon); // Debugging output
      setIsPolygonDisplayed(true); // Display the polygon only when the button is clicked and there is a saved polygon
    } else {
      alert("No polygon has been saved yet!");
    }
  };

  return (
    <>
      <header>
        <h1>Forestry Restoration Map</h1>
      </header>
      <div className="container">
        <div className="sidebar">
          <h2>Menu</h2>
          <ul>
            <li>Overview</li>
            <li>Plants</li>
            <li>Regions</li>
            <li>Impact</li>
          </ul>
          {/* Button to display the saved polygon */}
          <button onClick={handleDisplayPolygon}>Display Saved Polygon</button>
        </div>
        <div className="main-content">
          <h2>Mapping Restoration Efforts</h2>
          <div className="map-container">
            <MapComponent onSavePolygon={handleSavePolygon} isPolygonDisplayed={isPolygonDisplayed} savedPolygon={savedPolygon} />
          </div>
          {/* Separate section for displaying saved polygon coordinates */}
          <div className="polygon-data">
            <h3>Saved Polygon Coordinates</h3>
            {savedPolygon ? (
              <ul>
                {/* Safeguard check in case savedPolygon is a single object */}
                {Array.isArray(savedPolygon) ? (
                  savedPolygon.map((coord, index) => (
                    <li key={index}>{`Lat: ${coord.lat}, Lng: ${coord.lng}`}</li>
                  ))
                ) : (
                  <p>Invalid polygon data structure</p>
                )}
              </ul>
            ) : (
              <p>No polygon saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
