import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SmallMap from './SmallMap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaLeaf, FaTree, FaRecycle, FaWater } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MapDetails() {
  const location = useLocation();
  const { polygonData, metrics } = location.state;  // Access passed data

  // Date state for future functionality (model overlay)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Map labels to their corresponding icons
  const iconMap = {
    'Biomass Production': FaLeaf,
    'Plant Vitality': FaTree,
    'Invasive Species Removed': FaRecycle,
    'Water Retention': FaWater,
  };

  return (
    <div className="map-details-page p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">Detailed Map View</h2>

      {/* Large Map Section */}
      <div className="map-container w-full h-[500px] mb-8 rounded-lg overflow-hidden border border-gray-200">
        <SmallMap
          savedPolygon={polygonData.polygon}
          plantMarkers={polygonData.markers}
          isViewOnly={true}
          mapHeight="100%"
          mapWidth="100%"
        />
      </div>

      {/* Date/Time Picker */}
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

      {/* Stats Section */}
      <div className="stats-container w-full flex justify-between items-center space-x-4">
        {metrics.map((metric, i) => {
          const Icon = iconMap[metric.label];  // Get the correct icon for the label
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
