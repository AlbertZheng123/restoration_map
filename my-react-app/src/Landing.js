import React, { useState } from "react";
import Navbar from "./components/Navbar.js"; // Adjust the path based on your project structure
import { FiArrowRight, FiUser, FiSettings, FiActivity, FiLayers } from 'react-icons/fi'; // Example icons
import Spline from '@splinetool/react-spline';
import Login from './components/Login.js';

const Landing = () => {
  const [activeIcon, setActiveIcon] = useState(null);

  const iconData = [
    { icon: <FiUser size={50}/>, label: 'Profile', description: 'Manage your personal profile and settings.' },
    { icon: <FiSettings size={50}/>, label: 'Settings', description: 'Customize your experience and make it unique to your needs.' },
    { icon: <FiActivity size={50}/>, label: 'Activity', description: 'Track your activity and review your engagement stats.' },
    { icon: <FiLayers size={50}/>, label: 'Layers', description: 'Explore and manage your data with a comprehensive layer view.' }
  ];

  return (
    <div data-theme="dark" className="min-h-screen text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div
        id="hero"
        className="flex flex-col md:flex-row items-center justify-between min-h-screen py-12"
        style={{ backgroundColor: '#61CD5F' }}
      >
        {/* Hero Text Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 p-6">
          <h1 className="text-3xl text-black md:text-4xl lg:text-5xl font-bold mb-8">
            Lorem ipsum dolor sit amet, <br /> consectetur adipiscing elit
          </h1>
          <h3 className="text-black mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br /> Nulla et metus vehicula, tempus sapien nec, venenatis dui.
          </h3>
          <button className="btn btn-warning btn-lg flex items-center justify-center px-8 py-4 rounded-full">
            Lorem Ipsum Now
            <FiArrowRight className="ml-2" />
          </button>
        </div>

        {/* Spline Model Section */}
        <div className="md:w-1/2 h-full flex items-center justify-center">
          <Spline
            scene="https://prod.spline.design/8pqN6gl15p44NWTc/scene.splinecode"
            style={{ width: '100%', height: '100vh', borderRadius: '8px', overflow: 'hidden' }}
          />
        </div>
      </div>

      {/* About Section with Cupcake Theme */}
      <div id="about" data-theme="cupcake" className="bg-base-200 text-black w-full py-8 px-6">
        <div className="max-w-4xl mx-auto pt-8">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-4">Your Future Awaits</h2>
          <p className="text-md mb-8 text-center">
            Discover new opportunities and unlock your potential with our innovative solutions. Our platform is designed to empower you to achieve extraordinary results and reach new heights.
          </p>
          <p className="text-sm mb-2 text-center">
            Embrace the future with confidence and explore the boundless possibilities that await you. Our platform provides enriching experiences that help you develop your skills and broaden your horizons, one step at a time.
          </p>
          <p className="text-sm mb-2 text-center">
            From interactive learning modules to collaborative projects, you'll find a wealth of resources designed to help you succeed in every aspect of your life. Our community is here to support and inspire you every step of the way.
          </p>
          <p className="text-sm mb-2 text-center">
            Engage in cutting-edge workshops, gain insights from industry leaders, and connect with like-minded individuals. Your path to success begins here, with tools that allow you to innovate and create a lasting impact.
          </p>
          <p className="text-sm mb-2 text-center">
            Are you ready to take the leap and transform your future? Join us and unlock the power within you to achieve greatness.
          </p>
          <p className="text-sm text-center mb-2">
            As you embark on this journey, remember that every challenge is an opportunity to learn and grow. We believe in your potential and are committed to providing the guidance and resources you need to excel.
          </p>
          <p className="text-sm text-center">
            Let us be a part of your success story. Together, we can make your dreams a reality and build a brighter future.
          </p>

          {/* Icons Section */}
          <div className="flex justify-around mt-12">
            {iconData.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setActiveIcon(index)}
              >
                {item.icon}
                <p className="mt-2 text-lg">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Description Section */}
          {activeIcon !== null && (
            <p className="text-center mt-4 text-sm">{iconData[activeIcon].description}</p>
          )}
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
