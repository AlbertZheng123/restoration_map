// import React, { useState } from 'react';
// import './App.css';  // Ensure this file is included for the updated styles
// import Navbar from './components/Navbar';

// const nativePlants = [
//   { name: 'Oak', description: 'Oak trees are large, long-lived trees found in many parts of the world.' },
//   { name: 'Maple', description: 'Maple trees are known for their beautiful fall colors and their sap, which is used to make maple syrup.' },
//   { name: 'Pine', description: 'Pine trees are evergreen conifers that are commonly found in forests.' },
//   { name: 'Birch', description: 'Birch trees are known for their distinctive white bark and delicate leaves.' },
//   { name: 'Cedar', description: 'Cedar trees are aromatic evergreens often used for wood products.' }
// ];

// const invasivePlants = [
//   { name: 'Kudzu', description: 'Kudzu is an invasive vine that grows rapidly and can choke out other vegetation.' },
//   { name: 'Japanese Knotweed', description: 'This plant is notorious for its aggressive growth and ability to damage infrastructure.' },
//   { name: 'Garlic Mustard', description: 'Garlic mustard is an invasive herb that can displace native plants in forests.' },
//   { name: 'Purple Loosestrife', description: 'This invasive wetland plant can take over marshes, disrupting native ecosystems.' },
//   { name: 'Water Hyacinth', description: 'Water hyacinth is a floating aquatic plant that can block waterways and harm aquatic life.' }
// ];

// export default function PlantDatabase() {
//   const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
//   const [activeTab, setActiveTab] = useState("native"); // State to track which section is active

//   // Filter function for native and invasive plants
//   const filteredNativePlants = nativePlants.filter((plant) =>
//     plant.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredInvasivePlants = invasivePlants.filter((plant) =>
//     plant.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <>
//     <Navbar />
//     <div className="plant-database-container">
//       <h2>Plant & Invasive Species Database</h2>

//       {/* Horizontal Buttons to Toggle Between Native Plants and Invasive Species */}
//       <div className="tab-buttons">
//         <button
//           className={`tab-button ${activeTab === 'native' ? 'active' : ''}`}
//           onClick={() => setActiveTab('native')}
//         >
//           Native Plants
//         </button>
//         <button
//           className={`tab-button ${activeTab === 'invasive' ? 'active' : ''}`}
//           onClick={() => setActiveTab('invasive')}
//         >
//           Invasive Species
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder={`Search for a ${activeTab === 'native' ? 'native plant' : 'invasive species'}...`}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
//         />
//       </div>

//       {/* Display Native Plants or Invasive Species Based on Active Tab */}
//       <div className="plant-list">
//         {activeTab === 'native' ? (
//           <div className="section">
//             <h3>Native Plants</h3>
//             <ul>
//               {filteredNativePlants.length > 0 ? (
//                 filteredNativePlants.map((plant, index) => (
//                   <li key={index}>
//                     <strong>{plant.name}:</strong> {plant.description}
//                   </li>
//                 ))
//               ) : (
//                 <li>No native plants match your search.</li>
//               )}
//             </ul>
//           </div>
//         ) : (
//           <div className="section">
//             <h3>Invasive Species</h3>
//             <ul>
//               {filteredInvasivePlants.length > 0 ? (
//                 filteredInvasivePlants.map((plant, index) => (
//                   <li key={index}>
//                     <strong>{plant.name}:</strong> {plant.description}
//                   </li>
//                 ))
//               ) : (
//                 <li>No invasive species match your search.</li>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import './App.css'; // Ensure this file is included for the updated styles
import Navbar from './components/Navbar';

const nativePlants = [
  { name: 'Oak', description: 'Oak trees are large, long-lived trees found in many parts of the world.' },
  { name: 'Maple', description: 'Maple trees are known for their beautiful fall colors and their sap, which is used to make maple syrup.' },
  { name: 'Pine', description: 'Pine trees are evergreen conifers that are commonly found in forests.' },
  { name: 'Birch', description: 'Birch trees are known for their distinctive white bark and delicate leaves.' },
  { name: 'Cedar', description: 'Cedar trees are aromatic evergreens often used for wood products.' }
];

const invasivePlants = [
  { name: 'Kudzu', description: 'Kudzu is an invasive vine that grows rapidly and can choke out other vegetation.' },
  { name: 'Japanese Knotweed', description: 'This plant is notorious for its aggressive growth and ability to damage infrastructure.' },
  { name: 'Garlic Mustard', description: 'Garlic mustard is an invasive herb that can displace native plants in forests.' },
  { name: 'Purple Loosestrife', description: 'This invasive wetland plant can take over marshes, disrupting native ecosystems.' },
  { name: 'Water Hyacinth', description: 'Water hyacinth is a floating aquatic plant that can block waterways and harm aquatic life.' }
];

export default function PlantDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("native");

  const filteredNativePlants = nativePlants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvasivePlants = invasivePlants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white p-4 flex-shrink-0 h-screen">
        <Navbar />
      </div>

      <div className="flex-grow flex flex-col items-center bg-base-200 p-8">
        <div className="w-full max-w-3xl bg-gray-500 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Plant & Invasive Species Database</h2>

          {/* Horizontal Buttons to Toggle Between Native Plants and Invasive Species */}
          <div className="flex justify-center mb-6">
            <button
              className={`btn ${activeTab === 'native' ? 'btn-primary' : 'btn-outline'} mr-2`}
              onClick={() => setActiveTab('native')}
            >
              Native Plants
            </button>
            <button
              className={`btn ${activeTab === 'invasive' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('invasive')}
            >
              Invasive Species
            </button>
          </div>

          {/* Search Bar */}
          <div className="form-control mb-6">
            <input
              type="text"
              placeholder={`Search for a ${activeTab === 'native' ? 'native plant' : 'invasive species'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Display Native Plants or Invasive Species Based on Active Tab */}
          <div className="plant-list text-left">
            {activeTab === 'native' ? (
              <div className="section">
                <h3 className="text-xl font-semibold mb-4">Native Plants</h3>
                <ul className="list-disc pl-5">
                  {filteredNativePlants.length > 0 ? (
                    filteredNativePlants.map((plant, index) => (
                      <li key={index} className="mb-2">
                        <strong>{plant.name}:</strong> {plant.description}
                      </li>
                    ))
                  ) : (
                    <li>No native plants match your search.</li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="section">
                <h3 className="text-xl font-semibold mb-4">Invasive Species</h3>
                <ul className="list-disc pl-5">
                  {filteredInvasivePlants.length > 0 ? (
                    filteredInvasivePlants.map((plant, index) => (
                      <li key={index} className="mb-2">
                        <strong>{plant.name}:</strong> {plant.description}
                      </li>
                    ))
                  ) : (
                    <li>No invasive species match your search.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
