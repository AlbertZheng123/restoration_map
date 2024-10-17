import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';

export default function BiomassOverlayPage() {
  const location = useLocation();
  const { polygon, imageURL } = location.state || {}; // Get the polygon and image URL from state
  const mapRef = useRef(null);

  const correctedOverlayImageURL = `http://localhost:8000/media/generated/biomass_model.png`; 

  // Function to calculate the smallest square bounding box for the polygon
  const calculateBottomAlignedBoundingBox = (polygon) => {
    console.log("Calculating Bounding Box for Polygon:", polygon);  // Debugging Log
    let minLat = polygon[0][0], maxLat = polygon[0][0];
    let minLng = polygon[0][1], maxLng = polygon[0][1];

    // Find min/max lat and lng from the polygon
    polygon.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    // Calculate height (lat) and width (lng) distances in kilometers
    const latDiffKm = (maxLat - minLat) * 111.32;
    const lngDiffKm = (maxLng - minLng) * (111.32 * Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180)));

    // Use the maximum distance to form a square
    const maxDiffKm = Math.max(latDiffKm, lngDiffKm);

    // Convert back the max difference to latitude and longitude degrees
    const maxDiffLat = maxDiffKm / 111.32;
    const maxDiffLng = maxDiffKm / (111.32 * Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180)));

    // Adjust the square bounding box with bottom alignment
    const squareMinLat = minLat;
    const squareMaxLat = minLat + maxDiffLat;
    const squareMinLng = (minLng + maxLng) / 2 - maxDiffLng / 2;
    const squareMaxLng = (minLng + maxLng) / 2 + maxDiffLng / 2;

    return [[squareMinLat, squareMinLng], [squareMaxLat, squareMaxLng]];
  };

  const isValidLatLng = (lat, lng) => {
    const isValid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
    if (!isValid) {
      console.warn(`Invalid LatLng detected in polygon: lat=${lat}, lng=${lng}`);  // Debugging Warning
    }
    return isValid;
  };

  // Filter out invalid polygon points
  const validPolygon = polygon ? polygon.filter(point => isValidLatLng(point[0], point[1])) : null;

  const squareBounds = validPolygon ? calculateBottomAlignedBoundingBox(validPolygon) : null;

  // Fit map to bounds function
  function FitBounds({ polygon }) {
    const map = useMap();
    useEffect(() => {
      if (polygon && polygon.length > 0 && squareBounds) {
        const bounds = L.latLngBounds(squareBounds);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [polygon, map]);

    return null;
  }

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={validPolygon.length > 0 ? validPolygon[0] : [34.427, -118.57]}  // Fallback if no valid polygon points
        zoom={13}
        maxZoom={18}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)} // Store map instance in the ref
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render the valid polygon */}
        {validPolygon && <Polygon positions={validPolygon} color="blue" />}

        {/* Fit the map to the polygon's bounds */}
        <FitBounds polygon={validPolygon} />

        {/* Render the image overlay within square bounds */}
        {squareBounds && (
          <ImageOverlay
            id="overlay-image"
            url={correctedOverlayImageURL} // Use the image URL from the backend
            bounds={squareBounds}
            opacity={0.6} // Adjust the opacity of the overlay image
            interactive={false}
          />
        )}
      </MapContainer>
    </div>
  );
}
