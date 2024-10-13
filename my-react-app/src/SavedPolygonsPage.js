import React, { useState, useEffect } from 'react';
import SmallMap from './SmallMap'; // Reuse SmallMap component for rendering

export default function SavedPolygonsPage() {
  const [savedPolygons, setSavedPolygons] = useState([]);

  useEffect(() => {
    // Load saved polygons from localStorage when the component mounts
    const loadedPolygons = JSON.parse(localStorage.getItem('savedPolygons')) || [];
    setSavedPolygons(loadedPolygons);
  }, []); // Empty dependency array ensures this only runs once, on mount

  return (
    <div className="saved-polygons-page">
      <h2>Saved Polygon Sections</h2>

      {savedPolygons.length > 0 ? (
        savedPolygons.map((polygonData, index) => (
          <div
            key={index}
            className="saved-polygon-section"
            style={{
              marginBottom: '20px',
              width: '60%',      // Adjust the width so it doesn't stretch across the page
              margin: '0 auto',  // Center the map
              border: '2px solid #ccc',  // Add a border around the map
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)'  // Add a subtle shadow for visual depth
            }}
          >
            <h3>Polygon {index + 1}</h3>
            {/* Pass isViewOnly and a smaller height for the map */}
            <SmallMap
              savedPolygon={polygonData.polygon} 
              plantMarkers={polygonData.markers}
              isViewOnly={true}  // Ensures no plant selection UI
              mapHeight="200px"  // Set the map height to a smaller size
              mapWidth="100%"    // Ensure the map fits within the container
            />
          </div>
        ))
      ) : (
        <p>No polygons have been saved yet.</p>
      )}
    </div>
  );
}
