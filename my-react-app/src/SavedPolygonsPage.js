import React, { useState, useEffect } from 'react';
import SmallMap from './SmallMap'; // Reuse SmallMap component for rendering
import Sidebar from './components/Sidebar';

export default function SavedPolygonsPage() {
  const [savedPolygons, setSavedPolygons] = useState([]);

  useEffect(() => {
    // Load saved polygons from localStorage when the component mounts
    const loadedPolygons = JSON.parse(localStorage.getItem('savedPolygons')) || [];
    setSavedPolygons(loadedPolygons);
  }, []); // Empty dependency array ensures this only runs once, on mount

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white h-screen p-4 flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-grow p-8">
        <h2 className="text-center text-3xl font-bold mb-4">Saved Polygon Sections</h2>
        <div className="flex flex-col items-center">
          {savedPolygons.length > 0 ? (
            savedPolygons.map((polygonData, index) => (
              <div
                key={index}
                className="saved-polygon-section mb-6 w-full max-w-xl p-4 border border-gray-300 rounded-lg shadow-md mx-auto"
              >
                <h3 className="text-lg font-semibold mb-2">Polygon {index + 1}</h3>
                <SmallMap
                  savedPolygon={polygonData.polygon}
                  plantMarkers={polygonData.markers}
                  isViewOnly={true}
                  mapHeight="200px"
                  mapWidth="100%"
                />
              </div>
            ))
          ) : (
            <p className="text-center">No polygons have been saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
