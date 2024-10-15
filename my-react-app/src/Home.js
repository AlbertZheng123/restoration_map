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
//           className="mt-4 p-2 w-full btn btn-primary text-white hover:btn-ghost rounded"
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
import Navbar from './components/Sidebar';

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
    <div className="flex flex-col md:flex-row">
      {/* Sidebar with Navbar */}
      <div className="w-full md:w-64 bg-gray-800 text-white h-screen p-4 flex flex-col items-center">
        <Navbar />
        <button
          onClick={handleDisplayPolygon}
          className="mt-4 p-2 btn btn-primary text-black hover:btn-ghost rounded w-full"
        >
          Display Saved Polygon
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Mapping Restoration Efforts</h2>
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
