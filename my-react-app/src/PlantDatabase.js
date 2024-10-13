import React, { useState } from 'react';
import './App.css';  // Ensure this file is included for the updated styles

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
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [activeTab, setActiveTab] = useState("native"); // State to track which section is active

  // Filter function for native and invasive plants
  const filteredNativePlants = nativePlants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvasivePlants = invasivePlants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="plant-database-container">
      <h2>Plant & Invasive Species Database</h2>

      {/* Horizontal Buttons to Toggle Between Native Plants and Invasive Species */}
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'native' ? 'active' : ''}`}
          onClick={() => setActiveTab('native')}
        >
          Native Plants
        </button>
        <button
          className={`tab-button ${activeTab === 'invasive' ? 'active' : ''}`}
          onClick={() => setActiveTab('invasive')}
        >
          Invasive Species
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search for a ${activeTab === 'native' ? 'native plant' : 'invasive species'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </div>

      {/* Display Native Plants or Invasive Species Based on Active Tab */}
      <div className="plant-list">
        {activeTab === 'native' ? (
          <div className="section">
            <h3>Native Plants</h3>
            <ul>
              {filteredNativePlants.length > 0 ? (
                filteredNativePlants.map((plant, index) => (
                  <li key={index}>
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
            <h3>Invasive Species</h3>
            <ul>
              {filteredInvasivePlants.length > 0 ? (
                filteredInvasivePlants.map((plant, index) => (
                  <li key={index}>
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
  );
}
