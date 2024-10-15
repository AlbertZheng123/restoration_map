// import React, { useState } from 'react';
// import './App.css'; // Ensure this file is included for the updated styles
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
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("native");

//   const filteredNativePlants = nativePlants.filter((plant) =>
//     plant.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredInvasivePlants = invasivePlants.filter((plant) =>
//     plant.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex">
//       <div className="w-64 bg-gray-800 text-white p-4 flex-shrink-0 h-screen">
//         <Navbar />
//       </div>

//       <div className="flex-grow flex flex-col items-center bg-base-200 p-8">
//         <div className="w-full max-w-3xl bg-black shadow-md rounded-lg p-6">
//           <h2 className="text-2xl font-bold text-center mb-6">Plant & Invasive Species Database</h2>

//           {/* Horizontal Buttons to Toggle Between Native Plants and Invasive Species */}
//           <div className="flex justify-center mb-6">
//             <button
//               className={`btn ${activeTab === 'native' ? 'btn-primary' : 'btn-outline'} mr-2`}
//               onClick={() => setActiveTab('native')}
//             >
//               Native Plants
//             </button>
//             <button
//               className={`btn ${activeTab === 'invasive' ? 'btn-primary' : 'btn-outline'}`}
//               onClick={() => setActiveTab('invasive')}
//             >
//               Invasive Species
//             </button>
//           </div>

//           {/* Styled Search Bar */}
//           <div className="form-control mb-6 w-full">
//             <label className="input input-bordered flex items-center gap-2 w-full">
//               <input
//                 type="text"
//                 className="grow bg-transparent"
//                 placeholder={`Search for a ${activeTab === 'native' ? 'native plant' : 'invasive species'}...`}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                 <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
//               </svg>
//             </label>
//           </div>

//           {/* Display Native Plants or Invasive Species Based on Active Tab */}
//           <div className="plant-list text-left bg-black">
//             {activeTab === 'native' ? (
//               <div className="section bg-black">
//                 <h3 className="text-xl font-semibold mb-4">Native Plants</h3>
//                 <ul className="list-disc pl-5 bg-black">
//                   {filteredNativePlants.length > 0 ? (
//                     filteredNativePlants.map((plant, index) => (
//                       <li key={index} className="mb-2 bg-black" style={{backgroundColor: 'black'}}>
//                         <strong>{plant.name}:</strong> {plant.description}
//                       </li>
//                     ))
//                   ) : (
//                     <li style={{backgroundColor: 'black'}}>No native plants match your search.</li>
//                   )}
//                 </ul>
//               </div>
//             ) : (
//               <div className="section">
//                 <h3 className="text-xl font-semibold mb-4">Invasive Species</h3>
//                 <ul className="list-disc pl-5">
//                   {filteredInvasivePlants.length > 0 ? (
//                     filteredInvasivePlants.map((plant, index) => (
//                       <li key={index} className="mb-2 bg-black" style={{backgroundColor: 'black'}}>
//                         <strong>{plant.name}:</strong> {plant.description}
//                       </li>
//                     ))
//                   ) : (
//                     <li style={{backgroundColor: 'black'}}>No invasive species match your search.</li>
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import './App.css'; // Ensure this file is included for the updated styles
import Navbar from './components/Sidebar';

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
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-900 text-white p-4 flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex-grow flex flex-col items-center bg-gray-100 p-8">
        <div className="w-full max-w-3xl bg-white text-black shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Plant & Invasive Species Database</h2>

          {/* Horizontal Buttons to Toggle Between Native Plants and Invasive Species */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-lg mr-2 ${activeTab === 'native' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}`}
              onClick={() => setActiveTab('native')}
            >
              Native Plants
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'invasive' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}`}
              onClick={() => setActiveTab('invasive')}
            >
              Invasive Species
            </button>
          </div>

          {/* Styled Search Bar */}
          <div className="form-control mb-6 w-full">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <input
                type="text"
                className="flex-grow p-2 rounded-lg border border-gray-300"
                placeholder={`Search for a ${activeTab === 'native' ? 'native plant' : 'invasive species'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 opacity-70">
                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
              </svg>
            </label>
          </div>

          {/* Display Native Plants or Invasive Species Based on Active Tab */}
          <div className="plant-list text-left">
            {activeTab === 'native' ? (
              <div className="section">
                <h3 className="text-xl font-semibold mb-4">Native Plants</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {filteredNativePlants.length > 0 ? (
                    filteredNativePlants.map((plant, index) => (
                      <li key={index} className="mb-2 p-3 bg-gray-200 rounded-lg">
                        <strong>{plant.name}:</strong> {plant.description}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 bg-gray-200 rounded-lg">No native plants match your search.</li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="section">
                <h3 className="text-xl font-semibold mb-4">Invasive Species</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {filteredInvasivePlants.length > 0 ? (
                    filteredInvasivePlants.map((plant, index) => (
                      <li key={index} className="mb-2 p-3 bg-gray-200 rounded-lg">
                        <strong>{plant.name}:</strong> {plant.description}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 bg-gray-200 rounded-lg">No invasive species match your search.</li>
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
