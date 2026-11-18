import React, { useState } from 'react';
import { MapContainer, FeatureGroup, Polygon, TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useLocation, useNavigate } from 'react-router-dom';

import 'leaflet/dist/leaflet.css'; 
import 'leaflet-draw/dist/leaflet.draw.css';
// Function to determine polygon color based on the number of plants
const getPolygonColor = (plantCount) => {
  if (plantCount <= 20) return 'yellow';             
  if (plantCount <= 40) return 'greenyellow';        
  if (plantCount <= 60) return 'green';              
  return 'darkgreen';                                
};

export default function PolygonPlotPage() {
  const location = useLocation();
  const { polygon } = location.state || {};  
  const navigate = useNavigate();

  const [innerPolygons, setInnerPolygons] = useState([]);  

  const handleCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs();

    const plantCount = parseInt(prompt('Enter the number of plants for this polygon:'), 10);

    const newPolygon = {
      id: `polygon-${innerPolygons.length + 1}`,
      coords: latlngs[0], 
      plants: isNaN(plantCount) ? 0 : plantCount,  
    };

    setInnerPolygons((prevPolygons) => [...prevPolygons, newPolygon]);

    // Debugging to ensure inner polygons are being added correctly
    console.log("New inner polygon created:", newPolygon);
    console.log("Updated innerPolygons state:", [...innerPolygons, newPolygon]);
  };

  const savePolygonData = () => {
    try {
      let existingPolygons = localStorage.getItem('savedPolygonData');
      existingPolygons = existingPolygons ? JSON.parse(existingPolygons) : [];

      const polygonDataToSave = {
        type: 'polygon_with_inner_polygons',
        mainPolygon: polygon,   
        innerPolygons,          
      };

      localStorage.setItem('savedPolygonData', JSON.stringify([...existingPolygons, polygonDataToSave]));

      // Debugging to confirm saved data
      console.log("Polygon data to be saved:", polygonDataToSave);

      navigate('/impact');

    } catch (error) {
      console.error("Error saving polygon data:", error);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h2 style={{ textAlign: 'center', margin: '10px' }}>Plot Polygons Within the Main Polygon</h2>
      
      <MapContainer 
        center={[34.4269, -118.5754]} 
        zoom={20} 
        maxZoom={22} 
        style={{ height: "80vh", width: "100%" }}
      >
        <FeatureGroup>
          <EditControl
            position='topright'
            onCreated={handleCreated}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
              polygon: {
                allowIntersection: false,
                shapeOptions: {
                  color: '#bada55'
                }
              },
            }}
          />
        </FeatureGroup>

        <TileLayer
              attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
              maxZoom={22}
              tileSize={512}
              zoomOffset={-1}
            />

        <Polygon 
          positions={polygon} 
          color="black" 
          fillOpacity={0}  
        />

        {innerPolygons.map(({ id, coords, plants }) => (
          <Polygon 
            key={id} 
            positions={coords} 
            color="black"  
            fillColor={getPolygonColor(plants)}  
            fillOpacity={0.5}  
          />
        ))}
      </MapContainer>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={savePolygonData}
          style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Save Polygon and Plant Data
        </button>
      </div>
    </div>
  );
}
