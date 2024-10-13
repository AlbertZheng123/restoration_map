import React, { useState, useEffect } from 'react';
import SmallMap from './SmallMap'; // Use the same working SmallMap component
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'; // Import the circular progress bar
import 'react-circular-progressbar/dist/styles.css'; // Import the circular progress bar styles

export default function Impact() {
  const [savedPolygons, setSavedPolygons] = useState([]);

  // Load saved polygons from localStorage
  useEffect(() => {
    const loadedPolygons = JSON.parse(localStorage.getItem('savedPolygons')) || [];
    setSavedPolygons(loadedPolygons);
  }, []);

  // Dummy percentage data for progress bars (replace with actual data when available)
  const getRandomPercentage = () => Math.floor(Math.random() * 100);

  return (
    <div className="impact-container">
      <h2>Impact Sections</h2>
      <div className="impact-grid">
        {savedPolygons.length > 0 ? (
          savedPolygons.map((polygonData, index) => (
            <div key={index} className="impact-section">
              {/* Left side: SmallMap */}
              <div className="map-container">
                <SmallMap
                  savedPolygon={polygonData.polygon} 
                  plantMarkers={polygonData.markers}
                  isViewOnly={true} // View only mode to display saved polygons
                  mapHeight="300px" // Set a fixed height
                  mapWidth="100%"  // Ensure the map fits within the container
                />
              </div>

              {/* Right side: Circular progress bar */}
              <div className="progress-bar-container">
                <div style={{ width: '180px', height: '180px' }}> {/* Increased size */}
                  <CircularProgressbar
                    value={getRandomPercentage()} // Replace with actual data for progress
                    text={`${getRandomPercentage()}%`}
                    styles={buildStyles({
                      pathColor: `rgba(62, 152, 199, 0.85)`, // Customize color
                      textColor: '#333',
                      textSize: '24px', // Increase font size for the larger progress bar
                      pathTransitionDuration: 0.5,
                    })}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No polygons have been saved yet.</p>
        )}
      </div>
    </div>
  );
}
