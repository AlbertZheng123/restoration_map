// import React, { useState } from 'react';
// import MapComponent from './MapView';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './components/Navbar';

// export default function Home({ savedPolygon, setSavedPolygon }) {
//   const navigate = useNavigate(); // Hook to programmatically navigate
//   const [isPolygonDisplayed, setIsPolygonDisplayed] = useState(false); // State to handle polygon display
//   const [plantMarkers, setPlantMarkers] = useState([]); // Global state to store plant marker positions

//   // Function to save the polygon coordinates
//   const handleSavePolygon = (polygonCoords) => {
//     console.log("Polygon coordinates saved:", polygonCoords);
//     setSavedPolygon(polygonCoords); // Save the polygon coordinates to the parent state
//   };

//   // Function to save plant markers
//   const handleSavePlantMarkers = (markers) => {
//     setPlantMarkers(markers); // Save plant marker positions globally
//   };

//   // Function to navigate to the polygon page
//   const handleDisplayPolygon = () => {
//     if (savedPolygon) {
//       console.log("Displaying saved polygon:", savedPolygon);
//       setIsPolygonDisplayed(true); // Display the polygon on the main map (if needed)
//       navigate('/polygon'); // Redirect to the Polygon Page
//     } else {
//       alert("No polygon has been saved yet!");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="sidebar">
//         <Navbar />
//         {/* Button to display the saved polygon */}
//         <button onClick={handleDisplayPolygon}>Display Saved Polygon</button>
//       </div>
//       <div className="main-content">
//         <h2>Mapping Restoration Efforts</h2>
//         <div className="map-container">
//           {/* Main map component */}
//           <MapComponent 
//             onSavePolygon={handleSavePolygon} 
//             isPolygonDisplayed={isPolygonDisplayed} 
//             savedPolygon={savedPolygon} 
//             onSavePlantMarkers={handleSavePlantMarkers} 
//             plantMarkers={plantMarkers}
//             isPlantModeActive={false} // Plant mode deactivated for the big map
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import MapComponent from './MapView';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './components/Navbar';

// export default function Home({ savedPolygon, setSavedPolygon }) {
//   const navigate = useNavigate();
//   const [isPolygonDisplayed, setIsPolygonDisplayed] = useState(false);
//   const [plantMarkers, setPlantMarkers] = useState([]);

//   const handleSavePolygon = (polygonCoords) => {
//     console.log("Polygon coordinates saved:", polygonCoords);
//     setSavedPolygon(polygonCoords);
//   };

//   const handleSavePlantMarkers = (markers) => {
//     setPlantMarkers(markers);
//   };

//   const handleDisplayPolygon = () => {
//     if (savedPolygon) {
//       console.log("Displaying saved polygon:", savedPolygon);
//       setIsPolygonDisplayed(true);
//       navigate('/polygon');
//     } else {
//       alert("No polygon has been saved yet!");
//     }
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar with Navbar */}
//       <div className="w-64 bg-gray-800 text-white h-screen flex-shrink-0 p-4">
//         <Navbar />
//         <button
//           onClick={handleDisplayPolygon}
//           className="mt-4 p-2 w-full bg-blue-500 text-white hover:bg-blue-700 rounded"
//         >
//           Display Saved Polygon
//         </button>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-grow p-4 bg-gray-100">
//         <h2 className="text-2xl font-bold mb-4">Mapping Restoration Efforts</h2>
//         <div className="map-container bg-white shadow-md rounded p-2">
//           <MapComponent
//             onSavePolygon={handleSavePolygon}
//             isPolygonDisplayed={isPolygonDisplayed}
//             savedPolygon={savedPolygon}
//             onSavePlantMarkers={handleSavePlantMarkers}
//             plantMarkers={plantMarkers}
//             isPlantModeActive={false}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import MapComponent from './MapView';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function Home({ savedPolygon, setSavedPolygon }) {
  const navigate = useNavigate();
  const [isPolygonDisplayed, setIsPolygonDisplayed] = useState(false);
  const [plantMarkers, setPlantMarkers] = useState([]);

  const handleSavePolygon = (polygonCoords) => {
    console.log("Polygon coordinates saved:", polygonCoords);
    setSavedPolygon(polygonCoords);
  };

  const handleSavePlantMarkers = (markers) => {
    setPlantMarkers(markers);
  };

  const handleDisplayPolygon = () => {
    if (savedPolygon) {
      console.log("Displaying saved polygon:", savedPolygon);
      setIsPolygonDisplayed(true);
      navigate('/polygon');
    } else {
      alert("No polygon has been saved yet!");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar with Navbar */}
      <div className="w-64 bg-gray-800 text-white h-screen flex-shrink-0 p-4">
        <Navbar />
        <button
          onClick={handleDisplayPolygon}
          className="mt-4 p-2 w-full bg-blue-500 text-white hover:bg-blue-700 rounded"
        >
          Display Saved Polygon
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Mapping Restoration Efforts</h2>
        <div className="map-container bg-white shadow-md rounded p-2">
          <MapComponent
            onSavePolygon={handleSavePolygon}
            isPolygonDisplayed={isPolygonDisplayed}
            savedPolygon={savedPolygon}
            onSavePlantMarkers={handleSavePlantMarkers}
            plantMarkers={plantMarkers}
            isPlantModeActive={false}
          />
        </div>
      </div>
    </div>
  );
}
