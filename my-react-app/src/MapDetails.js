import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaLeaf, FaTree, FaRecycle, FaWater } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Include Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxAccessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;

const iconMap = {
  'Biomass Production': FaLeaf,
  'Plant Vitality': FaTree,
  'Invasive Species Removed': FaRecycle,
  'Water Retention': FaWater,
};

export default function MapDetails() {
  const location = useLocation();
  const { polygonData, metrics } = location.state || {};  
  
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Handle both polygon with inner polygons and polygons with markers
  const polygonPositions = polygonData?.type === 'polygon_with_markers' 
    ? polygonData.polygon.map(p => [p.lat, p.lng])  // Extract positions from `polygon`
    : polygonData?.mainPolygon?.map(p => [p.lat, p.lng]) || [];

  const markers = polygonData?.markers || [];

  // Fallback center if no positions are available
  const defaultCenter = [34.4269, -118.5754];

  // Log polygon data and positions for debugging
  useEffect(() => {
    console.log('Polygon Data passed to MapDetails:', polygonData);
    console.log('Polygon Positions:', polygonPositions);
    console.log('Markers:', markers); // Log markers for debugging

    if (polygonPositions.length === 0) {
      console.warn('Using default center because polygonPositions is empty');
    } else {
      console.log('Using polygon positions for map center and bounds');
    }
  }, [polygonData, polygonPositions, markers]);

  function FitBounds({ positions }) {
    const map = useMap();
    useEffect(() => {
      if (positions && positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        console.log('Fitting map to bounds:', bounds); // Log bounds for debugging
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [positions, map]);

    return null;
  }

  return (
    <div className="map-details-page p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">Detailed Map View</h2>

      <div className="map-container w-full h-[500px] mb-8 rounded-lg overflow-hidden border border-gray-200">
        {/* Check for the type of polygon and render accordingly */}
        {polygonData?.type === 'polygon_with_inner_polygons' ? (
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={polygonPositions[0] || defaultCenter}  // Ensure valid center
            zoom={13}
            maxZoom={22}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
              maxZoom={22}
              tileSize={512}
              zoomOffset={-1}
            />

            {/* Display the main polygon */}
            <Polygon positions={polygonPositions} color="black" fillOpacity={0} />

            {/* Display inner polygons */}
            {polygonData.innerPolygons.map((inner, i) => (
              <Polygon
                key={i}
                positions={inner.coords.map(p => [p.lat, p.lng])}
                color="black"
                fillOpacity={0.5}
                fillColor={inner.plants > 60 ? 'darkgreen' : inner.plants > 40 ? 'green' : inner.plants > 20 ? 'greenyellow' : 'yellow'}
              />
            ))}

            <FitBounds positions={polygonPositions} />
          </MapContainer>
        ) : polygonData?.type === 'polygon_with_markers' ? (
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={polygonPositions[0] || defaultCenter}  // Ensure valid center
            zoom={13}
            maxZoom={22}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
              maxZoom={22}
              tileSize={512}
              zoomOffset={-1}
            />

            {/* Display markers if they exist */}
            {markers.length > 0 && markers.map((marker, i) => (
              <Marker 
                key={i} 
                position={[marker.lat, marker.lng]} 
                icon={L.divIcon({
                  className: 'custom-icon',
                  html: `<div style="background-color:${marker.color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
                })}
              />
            ))}

            {/* Display the main polygon */}
            <Polygon positions={polygonPositions} color="black" fillOpacity={0} />

            <FitBounds positions={polygonPositions} />
          </MapContainer>
        ) : (
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={polygonPositions[0] || defaultCenter}  // Ensure valid center
            zoom={13}
            maxZoom={22}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
              maxZoom={22}
              tileSize={512}
              zoomOffset={-1}
            />

            {/* Display the main polygon as a fallback */}
            <Polygon positions={polygonPositions} color="black" fillOpacity={0} />

            <FitBounds positions={polygonPositions} />
          </MapContainer>
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
