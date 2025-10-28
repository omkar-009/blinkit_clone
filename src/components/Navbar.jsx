// src/components/Navbar.jsx
import React from "react";
import logo from "../assets/logo.webp";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img src={logo} alt="Blinkit Logo" className="w-32 md:w-40" />

          {/* Delivery Info */}
          <div className="flex flex-col leading-tight">
            <h4 className="text-4xl md:text-base font-bold text-gray-800">
              Delivery in 9 minutes
            </h4>
            <p className="text-xs md:text-sm text-gray-500">
              RTO Road, Nashik
            </p>
          </div>
        </div>

        {/* Login User */}
        <div className="flex items-center space-x-4">
          <p className="text-xl font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Login
          </p>

          {/* Future icons like Search / Cart can go here */}
          {/* <SearchIcon /> */}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
