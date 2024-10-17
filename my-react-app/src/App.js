import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SmallMapPage from './SmallMapPage';
import PlantDatabase from './PlantDatabase';
import Impact from './Impact';
import MapDetails from './MapDetails';  // Import the MapDetails component
import SavedPolygonsPage from './SavedPolygonsPage'; // Import the new Saved Polygons Page
import Landing from './Landing'; // Import the Landing Page
import BiomassOverlayPage from './BiomassOverlayPage';

function App() {
  const [savedPolygon, setSavedPolygon] = useState(null); // Global state to store the polygon
  const [plantMarkers, setPlantMarkers] = useState([]); // Global state to store plant marker positions

  const handleSavePlantMarkers = (markers) => {
    setPlantMarkers(markers); // Save plant marker positions globally
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Home savedPolygon={savedPolygon} setSavedPolygon={setSavedPolygon} />} 
        />
        <Route 
          path="/polygon" 
          element={
            <SmallMapPage 
              savedPolygon={savedPolygon} 
              plantMarkers={plantMarkers} 
              onSavePlantMarkers={handleSavePlantMarkers} 
            />
          } 
        />
        <Route 
          path="/plant-database" 
          element={<PlantDatabase />} // Plant Database page
        />
        <Route 
          path="/impact" 
          element={<Impact />} // Impact Page
        />
        <Route 
          path="/saved-polygons" 
          element={<SavedPolygonsPage />} // Route for the Saved Polygons Page
        />
        <Route 
          path="/home"
          element={<Home savedPolygon={savedPolygon} setSavedPolygon={setSavedPolygon} />}
        />
        <Route path="/" element={<Impact />} />
        <Route path="/map-details/:id" element={<MapDetails />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/biomass-overlay" element={<BiomassOverlayPage />} /> {/* Add new route */}
        <Route path="/biomass-overlay" element={<BiomassOverlayPage />} />
      </Routes>
    </Router>
  );
}

export default App;
