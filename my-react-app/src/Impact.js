import Navbar from './components/Sidebar';
import React, { useState, useEffect } from 'react';
import SmallMap from './SmallMap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaLeaf, FaTree, FaRecycle, FaWater } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link for navigation

export default function Impact() {
  const [savedPolygons, setSavedPolygons] = useState([]);

  useEffect(() => {
    const loadedPolygons = JSON.parse(localStorage.getItem('savedPolygons')) || [];
    setSavedPolygons(loadedPolygons);
  }, []);

  const getRandomPercentage = () => Math.floor(Math.random() * 100);
  const metrics = [
    { label: 'Biomass Production', value: getRandomPercentage() },
    { label: 'Plant Vitality', value: getRandomPercentage() },
    { label: 'Invasive Species Removed', value: getRandomPercentage() },
    { label: 'Water Retention', value: getRandomPercentage() },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white h-screen p-4 flex-shrink-0">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 bg-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center">Impact Dashboard</h2>
        
        <div className="impact-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {savedPolygons.length > 0 ? (
            savedPolygons.map((polygonData, index) => (
              <Link 
                key={index} 
                to={`/map-details/${index}`}  // Navigate to detailed map page
                state={{ polygonData, metrics }}  // Pass only serializable data (polygon and metrics)
                className="impact-section bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow cursor-pointer"
              >
                {/* Centered Title */}
                <h3 className="text-lg font-bold mb-6 text-center">Restoration Area {index + 1}</h3>

                {/* Map Section */}
                <div className="map-container w-full h-[300px] mb-6 rounded-lg overflow-hidden border border-gray-200">
                  <SmallMap
                    savedPolygon={polygonData.polygon}
                    plantMarkers={polygonData.markers}
                    isViewOnly={true}
                    mapHeight="100%"
                    mapWidth="100%"
                  />
                </div>
                
                {/* Stats Section (Lined Horizontally) */}
                <div className="stats-container w-full flex justify-between items-center space-x-4">
                  {metrics.map((metric, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className="w-16 h-16">
                        <CircularProgressbar
                          value={metric.value}
                          text={`${metric.value}%`}
                          styles={buildStyles({
                            pathColor: '#4CAF50',
                            textColor: '#333',
                            textSize: '12px',
                          })}
                        />
                      </div>
                      <p className="text-xs font-medium">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No polygons have been saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
