// import React, { useState, useEffect } from 'react';
// import SmallMap from './SmallMap';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import Navbar from './components/Navbar';

// export default function Impact() {
//   const [savedPolygons, setSavedPolygons] = useState([]);

//   // Load saved polygons from localStorage
//   useEffect(() => {
//     const loadedPolygons = JSON.parse(localStorage.getItem('savedPolygons')) || [];
//     setSavedPolygons(loadedPolygons);
//   }, []);

//   // Dummy percentage data for progress bars (replace with actual data when available)
//   const getRandomPercentage = () => Math.floor(Math.random() * 100);

//   return (
//     <div className="flex container mx-auto">
//       <Navbar />
//       <div className="impact-container flex-grow p-4">
//         <h2 className="text-2xl font-bold mb-4">Impact Sections</h2>
//         <div className="impact-grid grid grid-cols-1 md:grid-cols-2 gap-4">
//           {savedPolygons.length > 0 ? (
//             savedPolygons.map((polygonData, index) => (
//               <div key={index} className="impact-section flex flex-col md:flex-row items-center bg-white shadow-md rounded p-4">
//                 {/* Left side: SmallMap */}
//                 <div className="map-container w-full md:w-1/2 p-2">
//                   <SmallMap
//                     savedPolygon={polygonData.polygon} 
//                     plantMarkers={polygonData.markers}
//                     isViewOnly={true}
//                     mapHeight="300px"
//                     mapWidth="100%"
//                   />
//                 </div>

//                 {/* Right side: Circular progress bar */}
//                 <div className="progress-bar-container w-full md:w-1/2 p-2 flex justify-center">
//                   <div style={{ width: '180px', height: '180px' }}>
//                     <CircularProgressbar
//                       value={getRandomPercentage()}
//                       text={`${getRandomPercentage()}%`}
//                       styles={buildStyles({
//                         pathColor: `rgba(62, 152, 199, 0.85)`,
//                         textColor: '#333',
//                         textSize: '24px',
//                         pathTransitionDuration: 0.5,
//                       })}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500">No polygons have been saved yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import SmallMap from './SmallMap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from './components/Navbar';

export default function Impact() {
  const [savedPolygons, setSavedPolygons] = useState([]);

  // Load saved polygons from localStorage
  useEffect(() => {
    const loadedPolygons = JSON.parse(localStorage.getItem('savedPolygons')) || [];
    setSavedPolygons(loadedPolygons);
  }, []);

  // Dummy percentage data for progress bars (replace with actual data when available)
  const getRandomPercentage = () => Math.floor(Math.random() * 100);

  return (
    <div className="flex">
      {/* Sidebar with Navbar */}
      <div className="w-64 bg-gray-800 text-white h-screen p-4 flex-shrink-0">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="impact-container flex-grow p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Impact Sections</h2>
        <div className="impact-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPolygons.length > 0 ? (
            savedPolygons.map((polygonData, index) => (
              <div
                key={index}
                className="impact-section flex flex-col md:flex-row items-center bg-white shadow-md rounded p-4"
              >
                {/* Left side: SmallMap */}
                <div className="map-container w-full md:w-1/2 p-2">
                  <SmallMap
                    savedPolygon={polygonData.polygon}
                    plantMarkers={polygonData.markers}
                    isViewOnly={true}
                    mapHeight="300px"
                    mapWidth="100%"
                  />
                </div>
                
                {/* Right side: Circular progress bar */}
                <div className="progress-bar-container w-full md:w-1/2 p-2 flex justify-center">
                  <div style={{ width: '180px', height: '180px' }}>
                    <CircularProgressbar
                      value={getRandomPercentage()}
                      text={`${getRandomPercentage()}%`}
                      styles={buildStyles({
                        pathColor: `rgba(62, 152, 199, 0.85)`,
                        textColor: '#333',
                        textSize: '24px',
                        pathTransitionDuration: 0.5,
                      })}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No polygons have been saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
