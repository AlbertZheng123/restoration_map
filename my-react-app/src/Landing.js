// import React from "react";
// import Navbar from "./components/Navbar.js"; // Adjust the path based on your project structure
// import { FiArrowRight } from 'react-icons/fi';
// import Spline from '@splinetool/react-spline';
// import Login from './components/Login.js';

// const Landing = () => {
//   return (
//     <div data-theme="dark" className="bg-base-900 text-white min-h-screen">
//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <div className="flex flex-col items-center justify-start min-h-screen pt-28 pb-12">
//         <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
//           Lorem ipsum dolor sit amet, <br /> consectetur adipiscing elit
//         </h1>
//         <div className="flex items-center justify-center w-full max-w-screen-lg mt-8 px-4">
//           <h3 className="text-center text-gray-300">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br /> Nulla et metus vehicula, tempus sapien nec, venenatis dui.
//           </h3>
//         </div>
//         <div className="mt-8">
//           <button className="btn btn-warning btn-lg flex items-center justify-center px-8 py-4 rounded-full">
//             Lorem Ipsum Now
//             <FiArrowRight className="ml-2" />
//           </button>
//         </div>
//       </div>

//       {/* About Section with Dim Theme */}
//       <div data-theme="dim" className="bg-gray-800 text-white w-full py-8 px-6">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-6">About</h2>
//           <p className="text-lg mb-8 text-center">
//             Welcome to our platform. Here we aim to provide you with the best tools and resources for your learning and growth. Understanding your needs and delivering exceptional results are our top priorities.
//           </p>
//           <div className="flex flex-col md:flex-row items-start">
//             <div className="md:w-4/12 md:pr-6 mb-8 md:mb-0">
//               <Spline
//                 scene="https://prod.spline.design/zJIIheaMs63907A5/scene.splinecode"
//                 style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}
//               />
//             </div>
//             <div className="md:w-8/12">
//               <p className="text-lg mb-4">
//                 Our model presentation tool offers a seamless blend of creativity and functionality. Experience cutting-edge visualization that enables a deeper understanding of the concepts you explore.
//               </p>
//               <p className="text-lg mb-4">
//                 Our team is dedicated to providing comprehensive support and guidance. We utilize innovative technology and expert insights to help you navigate through your learning journey with confidence and clarity.
//               </p>
//               <p className="text-lg">
//                 Whether you are a beginner or an experienced professional, our resources are tailored to meet your needs. Join us to unlock your potential and achieve your goals with ease.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Landing;

import React from "react";
import Navbar from "./components/Navbar.js"; // Adjust the path based on your project structure
import { FiArrowRight } from 'react-icons/fi';
import Spline from '@splinetool/react-spline';
import Login from './components/Login.js';

const Landing = () => {
  return (
    <div data-theme="dark" className="bg-base-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div id="hero" className="flex flex-col items-center justify-start min-h-screen pt-28 pb-12">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
          Lorem ipsum dolor sit amet, <br /> consectetur adipiscing elit
        </h1>
        <div className="flex items-center justify-center w-full max-w-screen-lg mt-8 px-4">
          <h3 className="text-center text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br /> Nulla et metus vehicula, tempus sapien nec, venenatis dui.
          </h3>
        </div>
        <div className="mt-8">
          <button className="btn btn-warning btn-lg flex items-center justify-center px-8 py-4 rounded-full">
            Lorem Ipsum Now
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* About Section with Dim Theme */}
      <div id="about" data-theme="dim" className="bg-gray-800 text-white w-full py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-6">About</h2>
          <p className="text-lg mb-8 text-center">
            Welcome to our platform. Here we aim to provide you with the best tools and resources for your learning and growth. Understanding your needs and delivering exceptional results are our top priorities.
          </p>
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-4/12 md:pr-6 mb-8 md:mb-0">
              <Spline
                scene="https://prod.spline.design/zJIIheaMs63907A5/scene.splinecode"
                style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}
              />
            </div>
            <div className="md:w-8/12">
              <p className="text-lg mb-4">
                Our model presentation tool offers a seamless blend of creativity and functionality. Experience cutting-edge visualization that enables a deeper understanding of the concepts you explore.
              </p>
              <p className="text-lg mb-4">
                Our team is dedicated to providing comprehensive support and guidance. We utilize innovative technology and expert insights to help you navigate through your learning journey with confidence and clarity.
              </p>
              <p className="text-lg">
                Whether you are a beginner or an experienced professional, our resources are tailored to meet your needs. Join us to unlock your potential and achieve your goals with ease.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div id="login" className="bg-base-200 text-black w-full py-8 px-6 min-h-screen">
        <Login />
      </div>
    </div>
  );
};

export default Landing;
