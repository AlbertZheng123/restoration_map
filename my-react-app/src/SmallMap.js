import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Include Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxAccessToken = 'sk.eyJ1IjoiYWxiZXJ0emhlbmciLCJhIjoiY20yY3E0bG43MGlmZzJscG10Mnk0NzBiaiJ9.XaaAKQmi-TQtWflh72WvYw';

export default function SmallMap({ savedPolygon, onSavePlantMarkers, plantMarkers = [], isViewOnly = false, mapHeight = "400px" }) {
  const [localPlantMarkers, setLocalPlantMarkers] = useState(plantMarkers);
  const [activeSpecies, setActiveSpecies] = useState(null); 

  const nativePlantSpecies = [
    { name: 'Oak', color: 'green' },
    { name: 'Maple', color: 'green' },
    { name: 'Pine', color: 'green' },
    { name: 'Birch', color: 'green' },
    { name: 'Cedar', color: 'green' }
  ];

  const invasivePlantSpecies = [
    { name: 'Kudzu', color: 'red' },
    { name: 'Japanese Knotweed', color: 'red' },
    { name: 'Garlic Mustard', color: 'red' },
    { name: 'Purple Loosestrife', color: 'red' },
    { name: 'Water Hyacinth', color: 'red' }
  ];

  useEffect(() => {
    setLocalPlantMarkers(plantMarkers);
  }, [plantMarkers]);

  const handleMapClick = (e) => {
    if (isViewOnly || !activeSpecies) return;

    const newMarker = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      species: activeSpecies.name,
      color: activeSpecies.color
    };

    const updatedMarkers = [...localPlantMarkers, newMarker];
    setLocalPlantMarkers(updatedMarkers);
    onSavePlantMarkers && onSavePlantMarkers(updatedMarkers);
  };

  const handleSelection = (type, speciesName) => {
    if (isViewOnly) return;

    const speciesList = type === 'native' ? nativePlantSpecies : invasivePlantSpecies;
    const selectedSpecies = speciesList.find(species => species.name === speciesName);
    setActiveSpecies(selectedSpecies);
  };

  const createCircleMarker = (color) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${color}; width:16px; height:16px; border-radius:50%; border: 2px solid ${color};"></div>`,
      iconSize: [16, 16]
    });
  };

  const validPolygon = savedPolygon ? savedPolygon.filter(point => point.lat && point.lng) : [];
  const validMarkers = localPlantMarkers.filter(marker => marker.lat && marker.lng);

  return (
    <div style={{ height: mapHeight, width: '100%' }}>
      {!isViewOnly && (
        <div>
          <h3>Native Plant Species</h3>
          <select onChange={(e) => handleSelection('native', e.target.value)}>
            <option value="">Select Native Plant</option>
            {nativePlantSpecies.map((species, index) => (
              <option key={index} value={species.name}>
                {species.name}
              </option>
            ))}
          </select>

          <h3>Invasive Plant Species</h3>
          <select onChange={(e) => handleSelection('invasive', e.target.value)}>
            <option value="">Select Invasive Plant</option>
            {invasivePlantSpecies.map((species, index) => (
              <option key={index} value={species.name}>
                {species.name}
              </option>
            ))}
          </select>

          <p>Current Selected Species: {activeSpecies ? activeSpecies.name : 'None'}</p>
        </div>
      )}

      <MapContainer style={{ height: '100%', width: "100%" }} center={[34.4269, -118.5754]} zoom={10}>
      <TileLayer
              attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
              maxZoom={22}
              tileSize={512}
              zoomOffset={-1}
            />

        {validPolygon.length > 0 && (
          <>
            <Polygon positions={validPolygon.map(({ lat, lng }) => [lat, lng])} color="blue" />
            <FocusMap polygon={validPolygon} markers={validMarkers} />
          </>
        )}

        {!isViewOnly && <MapInteractionHandler activeSpecies={activeSpecies} onMapClick={handleMapClick} />}

        {validMarkers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.lat, marker.lng]} 
            icon={createCircleMarker(marker.color)}
          />
        ))}
      </MapContainer>
    </div>
  );
}

// Handle plant mode interactions
function MapInteractionHandler({ activeSpecies, onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (activeSpecies) {
        onMapClick(e);
      }
    },
  });

  return null;
}

// Focus the map on polygon and markers
function FocusMap({ polygon, markers }) {
  const map = useMapEvents({});

  useEffect(() => {
    if ((polygon && polygon.length > 0) || (markers && markers.length > 0)) {
      const allPoints = [
        ...polygon.map(({ lat, lng }) => [lat, lng]), 
        ...markers.map(({ lat, lng }) => [lat, lng])
      ];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds);
    }
  }, [polygon, markers, map]);

  return null;
}
