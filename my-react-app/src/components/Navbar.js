import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CollapsibleSidebar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Logo */}
            <div className="fixed top-4 left-4 z-50">
                <a onClick={() => navigate('/landing')} className="flex items-center space-x-3 rtl:space-x-reverse btn btn-ghost text-xl">
                    <span className="self-center font-changa text-black text-2xl font-semibold">ABCXYZ</span>
                </a>
            </div>

            {/* Hamburger Button */}
            <button 
                onClick={toggleSidebar} 
                className={`fixed top-4 right-4 z-50 p-2 rounded-md transition-all duration-300 ${isOpen ? 'bg-gray-600' : 'bg-gray-800'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full pt-16">
                    <nav className="flex-grow">
                        <ul className="space-y-4 px-4">
                            <li><a href="#about" className="block py-2 hover:bg-gray-700 rounded">About</a></li>
                            <li><a href="#pricing" className="block py-2 hover:bg-gray-700 rounded">Pricing</a></li>
                            <li><a href="#faq" className="block py-2 hover:bg-gray-700 rounded">FAQ</a></li>
                            <li><a href="/test" className="block py-2 hover:bg-gray-700 rounded">Test</a></li>
                            <li><a href="/login" className="block py-2 hover:bg-gray-700 rounded">Login</a></li>
                        </ul>
                    </nav>
                    <div className="p-4">
                        <button onClick={() => navigate('/Home')} className="w-full btn btn-primary">
                            Home
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
}

export default CollapsibleSidebar;