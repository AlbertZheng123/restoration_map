import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';

const mapboxAccessToken = 'sk.eyJ1IjoiYWxiZXJ0emhlbmciLCJhIjoiY20yY3E0bG43MGlmZzJscG10Mnk0NzBiaiJ9.XaaAKQmi-TQtWflh72WvYw';

export default function BiomassOverlayPage() {
  const location = useLocation();
  const { polygon, imageURL } = location.state || {}; 
  const mapRef = useRef(null);

  const correctedOverlayImageURL = `http://localhost:8000/media/generated/biomass_model.png`;

  const calculateBottomAlignedBoundingBox = (polygon) => {
    let minLat = polygon[0][0], maxLat = polygon[0][0];
    let minLng = polygon[0][1], maxLng = polygon[0][1];

    polygon.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    const latDiffKm = (maxLat - minLat) * 111.32;
    const lngDiffKm = (maxLng - minLng) * (111.32 * Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180)));

    const maxDiffKm = Math.max(latDiffKm, lngDiffKm);
    const maxDiffLat = maxDiffKm / 111.32;
    const maxDiffLng = maxDiffKm / (111.32 * Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180)));

    const squareMinLat = minLat;
    const squareMaxLat = minLat + maxDiffLat;
    const squareMinLng = (minLng + maxLng) / 2 - maxDiffLng / 2;
    const squareMaxLng = (minLng + maxLng) / 2 + maxDiffLng / 2;

    return [[squareMinLat, squareMinLng], [squareMaxLat, squareMaxLng]];
  };

  const isValidLatLng = (lat, lng) => {
    const isValid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
    if (!isValid) {
      console.warn(`Invalid LatLng detected in polygon: lat=${lat}, lng=${lng}`);
    }
    return isValid;
  };

  const validPolygon = polygon ? polygon.filter(point => isValidLatLng(point[0], point[1])) : null;
  const squareBounds = validPolygon ? calculateBottomAlignedBoundingBox(validPolygon) : null;

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
        center={validPolygon.length > 0 ? validPolygon[0] : [34.427, -118.57]}  
        zoom={13}
        maxZoom={18}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
         <TileLayer
  attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
  maxZoom={22}  // Ensure maxZoom is set
  tileSize={512}  // Increase tile size for higher zoom resolution
  zoomOffset={-1}  // Adjust offset for better high-zoom performance
/>

        {validPolygon && <Polygon positions={validPolygon} color="blue" />}
        <FitBounds polygon={validPolygon} />

        {squareBounds && (
          <ImageOverlay
            id="overlay-image"
            url={correctedOverlayImageURL}
            bounds={squareBounds}
            opacity={0.6}
            interactive={false}
          />
        )}
      </MapContainer>
    </div>
  );
}
