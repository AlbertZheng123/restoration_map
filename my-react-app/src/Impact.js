import Navbar from './components/Navbar';
import React, { useState, useEffect } from 'react';
import SmallMap from './SmallMap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';

export default function Impact() {
  const [savedPolygons, setSavedPolygons] = useState([]);

  useEffect(() => {
    const loadedPolygons = JSON.parse(localStorage.getItem('savedPolygonData')) || [];

    // Correctly format the polygons (with or without inner polygons)
    const formattedPolygons = loadedPolygons.map(polygonData => {
      if (polygonData.type === 'polygon_with_inner_polygons') {
        return {
          ...polygonData,
          mainPolygon: (polygonData.mainPolygon || []).map(point => {
            return { lat: point.lat, lng: point.lng };
          }),
          innerPolygons: (polygonData.innerPolygons || []).map(inner => ({
            ...inner, // Ensure each inner polygon maintains its data structure
            coords: (inner.coords || []).map(coord => {
              return { lat: coord.lat, lng: coord.lng };
            })
          }))
        };
      } else if (polygonData.type === 'polygon_with_markers') {
        return {
          ...polygonData,
          polygon: (polygonData.polygon || []).map(point => {
            return { lat: point.lat, lng: point.lng };
          }),
          markers: (polygonData.markers || []).map(marker => {
            return { lat: marker.lat, lng: marker.lng, color: marker.color || 'green' }; // Ensure color is defined
          })
        };
      }
      return polygonData;
    });

    setSavedPolygons(formattedPolygons);
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
                state={{ polygonData, metrics }}  // Pass polygon data and metrics
                className="impact-section bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-bold mb-6 text-center">Restoration Area {index + 1}</h3>

                <div className="map-container w-full h-[300px] mb-6 rounded-lg overflow-hidden border border-gray-200">
                  {polygonData.type === 'polygon_with_markers' ? (
                    <SmallMap
                      savedPolygon={polygonData.polygon || []}  // Ensure savedPolygon is an array
                      plantMarkers={polygonData.markers || []}  // Ensure plantMarkers is an array
                      isViewOnly={true}
                      mapHeight="100%"
                      mapWidth="100%"
                    />
                  ) : polygonData.type === 'polygon_with_inner_polygons' ? (
                    <SmallMap
                      savedPolygon={polygonData.mainPolygon || []}  // Ensure mainPolygon is an array
                      innerPolygons={polygonData.innerPolygons || []}  // Ensure innerPolygons is an array
                      isViewOnly={true}
                      mapHeight="100%"
                      mapWidth="100%"
                    />
                  ) : (
                    <SmallMap
                      savedPolygon={polygonData.polygon || []}  // Default polygon case
                      isViewOnly={true}
                      mapHeight="100%"
                      mapWidth="100%"
                    />
                  )}
                </div>

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
