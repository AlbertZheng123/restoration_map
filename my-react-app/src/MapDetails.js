import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Marker, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaLeaf, FaTree, FaRecycle, FaWater } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const iconMap = {
  'Biomass Production': FaLeaf,
  'Plant Vitality': FaTree,
  'Invasive Species Removed': FaRecycle,
  'Water Retention': FaWater,
};

const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
  });
};

export default function MapDetails() {
  const location = useLocation();
  const { polygonData, metrics } = location.state || {};  
  
  const [selectedDate, setSelectedDate] = useState(new Date());

  const polygonPositions = polygonData?.polygon?.map(p => [p.lat, p.lng]) || [];
  const markers = polygonData?.markers || [];

  function FitBounds({ positions }) {
    const map = useMap();
    useEffect(() => {
      if (positions && positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [positions, map]);

    return null;
  }

  useEffect(() => {
    console.log('Polygon Data passed:', polygonData);
    console.log('Markers:', markers);
  }, [polygonData, markers]);

  return (
    <div className="map-details-page p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">Detailed Map View</h2>

      <div className="map-container w-full h-[500px] mb-8 rounded-lg overflow-hidden border border-gray-200">
        {polygonPositions.length > 0 ? (
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={polygonPositions[0]} 
            zoom={13}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Polygon positions={polygonPositions} color="blue" />

            <FitBounds positions={polygonPositions} />

            {polygonData.imageURL && (
              <ImageOverlay
                url={polygonData.imageURL}
                bounds={L.latLngBounds(polygonPositions)}  
                opacity={0.6}
              />
            )}

            {markers.map((marker, i) => (
              <Marker 
                key={i} 
                position={[marker.lat, marker.lng]} 
                icon={createIcon(marker.color)}
              />
            ))}

          </MapContainer>
        ) : (
          <p>Map data is missing or not available</p>
        )}
      </div>

      <div className="calendar-container mb-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Select Date for Plant Growth Prediction</h3>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="border border-gray-300 rounded-md p-2"
        />
        <p className="text-sm mt-4">Selected Date: {selectedDate.toLocaleString()}</p>
      </div>

      <div className="stats-container w-full flex justify-between items-center space-x-4">
        {metrics.map((metric, i) => {
          const Icon = iconMap[metric.label];
          return (
            <div key={i} className="flex flex-col items-center text-center">
              <Icon className="text-3xl text-green-600 mb-2" />
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={metric.value}
                  text={`${metric.value}%`}
                  styles={buildStyles({
                    pathColor: '#4CAF50',
                    textColor: '#333',
                    textSize: '14px',
                  })}
                />
              </div>
              <p className="text-sm font-medium">{metric.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
