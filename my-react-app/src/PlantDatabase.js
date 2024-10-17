import React, { useState } from 'react';
import './App.css'; // Ensure this file is included for the updated styles
import Navbar from './components/Sidebar'; // Adjust path if necessary

const nativePlants = [
  { name: 'Oak', description: 'Oak trees are large, long-lived trees found worldwide.' },
  { name: 'Maple', description: 'Maple trees are known for their beautiful fall colors and syrup.' },
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
  
  const filteredPlants = activeTab === 'native'
    ? nativePlants.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : invasivePlants.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-base-300 text-base-content">
      <div className="w-64 bg-base-200 text-base-content p-4 flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex-grow flex flex-col items-center bg-base-200 p-8">
        <div className="w-full max-w-3xl bg-base-100 text-base-content shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Plant & Invasive Species Database</h2>

          {/* Tab and Search Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                className={`btn btn-neutral ${activeTab === 'native' ? 'btn-active' : ''}`}
                onClick={() => setActiveTab('native')}
              >
                Native Plants
              </button>
              <button
                className={`btn btn-neutral ${activeTab === 'invasive' ? 'btn-active' : ''}`}
                onClick={() => setActiveTab('invasive')}
              >
                Invasive Species
              </button>
            </div>

            <input
              type="text"
              className="input input-bordered w-64"
              placeholder={`Search ${activeTab === 'native' ? 'native plants' : 'invasive species'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Plant Table */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlants.length > 0 ? (
                  filteredPlants.map((plant, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{plant.name}</td>
                      <td>{plant.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No plants match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls (Placeholder if needed) */}
          <div className="flex justify-between items-center py-4">
            <p className="text-sm">Page 1 of 1</p>
            <div className="flex space-x-2">
              <button className="btn btn-xs">Previous</button>
              <button className="btn btn-xs">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
