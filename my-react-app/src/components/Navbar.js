// // src/components/Navbar.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function Navbar() {
//   const navigate = useNavigate();
  
//   return (
//     <div className="sidebar">  {/* or className="navbar" */}
//       <h2>Menu</h2>
//       <ul>
//         <li onClick={() => navigate('/home')}>Overview</li>
//         <li>Plants</li>
//         <li>Regions</li>
//         <li onClick={() => navigate('/impact')}>Impact</li>
//         <li onClick={() => navigate('/plant-database')}>Plant Database</li>
//         <li onClick={() => navigate('/saved-polygons')}>View Saved Polygons</li>
//       </ul>
//     </div>
//   );
// }

// export default Navbar;
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-64 bg-gray-900 text-white p-4 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        <li className="cursor-pointer hover:bg-gray-800 p-2 rounded" onClick={() => navigate('/home')}>
          Overview
        </li>
        <li className="cursor-pointer hover:bg-gray-800 p-2 rounded">
          Plants
        </li>
        <li className="cursor-pointer hover:bg-gray-800 p-2 rounded">
          Regions
        </li>
        <li className="cursor-pointer hover:bg-gray-800 p-2 rounded" onClick={() => navigate('/impact')}>
          Impact
        </li>
        <li className="cursor-pointer hover:bg-gray-800 p-2 rounded" onClick={() => navigate('/plant-database')}>
          Plant Database
        </li>
        <li className="cursor-pointer hover:bg-gray-800 p-2 rounded" onClick={() => navigate('/saved-polygons')}>
          View Saved Polygons
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
