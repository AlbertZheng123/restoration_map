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

  useEffect(() => {
    console.log('Saved Polygon:', savedPolygon);
    console.log('Plant Markers:', localPlantMarkers);
  }, [savedPolygon, localPlantMarkers]);

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

  // Validation function for LatLng objects (with lat/lng keys)
  const isValidLatLngObject = (point) => {
    const { lat, lng } = point || {};
    const isValid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

    if (!isValid) {
      console.warn(`Invalid LatLng detected: Lat=${lat}, Lng=${lng}`);
    }

    return isValid;
  };

  // Filter invalid LatLng objects in the polygon
  const validPolygon = savedPolygon ? savedPolygon.filter(isValidLatLngObject) : [];

  // If no valid polygon points, log and avoid rendering polygon
  useEffect(() => {
    if (validPolygon.length === 0) {
      console.warn('No valid polygon points to render.');
    }
  }, [validPolygon]);

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

        {/* Render valid polygon */}
        {validPolygon.length > 0 ? (
          <>
            <Polygon positions={validPolygon.map(({ lat, lng }) => [lat, lng])} color="blue" />
            <FocusPolygon polygon={validPolygon} /> {/* Define this component */}
          </>
        ) : (
          <p>No valid polygon points to display.</p>
        )}

        {!isViewOnly && <MapInteractionHandler activeSpecies={activeSpecies} onMapClick={handleMapClick} />}

        {/* Render plant markers */}
        {localPlantMarkers.map((marker, index) => (
          isValidLatLngObject(marker) && (
            <Marker 
              key={index} 
              position={[marker.lat, marker.lng]} 
              icon={createCircleMarker(marker.color)} // Use circle markers with species color
            />
          )
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
      const bounds = L.latLngBounds(polygon.map(({ lat, lng }) => [lat, lng]));
      map.fitBounds(bounds); // Adjust the map view to fit the polygon bounds
    } else {
      console.warn('FocusPolygon: No valid polygon points for fitting bounds.');
    }
  }, [polygon, map]);

  return null;
}
