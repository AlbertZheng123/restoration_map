import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

export default function SmallMap({ savedPolygon, onSavePlantMarkers, plantMarkers = [], isViewOnly = false, mapHeight = "400px" }) {
  const [localPlantMarkers, setLocalPlantMarkers] = useState(plantMarkers);
  const [activeSpecies, setActiveSpecies] = useState(null); // Tracks active species (either plant or invasive)

  // List of native and invasive plant species
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
    if (isViewOnly || !activeSpecies) {
      return; // No markers placed if in view-only mode or no species is selected
    }

    const newMarker = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      species: activeSpecies.name, // Save the species name
      color: activeSpecies.color // Save the color (green for native, red for invasive)
    };

    const updatedMarkers = [...localPlantMarkers, newMarker];
    setLocalPlantMarkers(updatedMarkers); // Update local markers state

    if (onSavePlantMarkers) {
      onSavePlantMarkers(updatedMarkers); // Save the updated markers globally
    }
  };

  const handleSelection = (type, speciesName) => {
    if (isViewOnly) return; // Don't allow selection in view-only mode

    if (type === 'native') {
      const selectedSpecies = nativePlantSpecies.find((species) => species.name === speciesName);
      setActiveSpecies(selectedSpecies);
    } else if (type === 'invasive') {
      const selectedSpecies = invasivePlantSpecies.find((species) => species.name === speciesName);
      setActiveSpecies(selectedSpecies);
    }
  };

  // Create circle marker icon
  const createCircleMarker = (color) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${color}; width:12px; height:12px; border-radius:50%;"></div>`,
      iconSize: [12, 12]
    });
  };

  return (
    <div style={{ height: mapHeight, width: '100%' }}>  {/* Directly apply height here */}
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {savedPolygon && savedPolygon.length > 0 && (
          <>
            <Polygon positions={savedPolygon} color="blue" />
            <FocusPolygon polygon={savedPolygon} /> {/* Define this component */}
          </>
        )}

        {!isViewOnly && <MapInteractionHandler activeSpecies={activeSpecies} onMapClick={handleMapClick} />}

        {localPlantMarkers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.lat, marker.lng]} 
            icon={createCircleMarker(marker.color)} // Use circle markers with species color
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

// Component to focus the map on the polygon bounds
function FocusPolygon({ polygon }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (polygon && polygon.length > 0) {
      const bounds = L.latLngBounds(polygon);
      map.fitBounds(bounds); // Adjust the map view to fit the polygon bounds
    }
  }, [polygon, map]);

  return null;
}
