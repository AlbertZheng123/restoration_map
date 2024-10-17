// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import { MapContainer, TileLayer, Polygon, ImageOverlay } from 'react-leaflet';
// import L from 'leaflet';

// export default function BiomassOverlayPage() {
//   const location = useLocation();
//   const { imageURL, polygon } = location.state || {};  // Extract data from location state
//   console.log("Overlay image URL:", imageURL);
//   if (!imageURL || !polygon) {
//     return <p>Missing image or polygon data. Please go back and try again.</p>;
//   }

//   // Calculate bounds for the image overlay based on polygon coordinates
//   const bounds = L.latLngBounds(polygon);

//   return (
//     <div>
//       <h1>Biomass Overlay</h1>

//       <MapContainer style={{ height: '600px', width: '100%' }} center={polygon[0]} zoom={15}>
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Render the polygon */}
//         <Polygon positions={polygon} color="blue" />

//         {/* Render the image overlay */}
        
//         <ImageOverlay
//           url={imageURL}  // Use the image URL returned by the backend
//           bounds={bounds}  // Fit the image within the polygon bounds
//         />
//       </MapContainer>
//     </div>
//   );
// }
