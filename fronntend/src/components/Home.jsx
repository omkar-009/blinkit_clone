import React, { useState } from "react";
import Products from "./Products";
import logo from "../assets/logo.webp";
import HeroImage from "../assets/baner.webp";
import Pharmacy from "../assets/pharmacy.avif";
import Babycare from "../assets/babycare.avif";
import Petcare from "../assets/Pet-Care.avif";
import { ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    setShowLogin(false);
  };

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-evenly px-6 py-2">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Blinkit Logo" className="w-28 md:w-28" />
            <div className="leading-tight">
              <h5 className="text-lg md:text-base font-bold text-gray-800">
                Delivery in 16 minutes
              </h5>
              <p className="text-xs md:text-sm text-gray-500 truncate w-44">
                35, College Rd, Krishi Nagar, Nashik
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center flex-1 mx-6">
            <div className="relative w-full max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder='Search "paneer"'
                className="bg-gray-50 w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Login + Cart */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowLogin(true)}
              className="text-lg font-medium text-gray-700 hover:text-gray-800 transition"
            >
              Login
            </button>

            <button className="flex items-center bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition">
              <ShoppingCart size={22} className="mr-2" />
              <span className="sm:inline font-medium">My Cart</span>
            </button>
          </div>
        </nav>
      </header>
      
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-80 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Login to Blinkit
            </h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Login
              </button>
            </form>

            {/* Register Option */}
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-green-600 font-medium hover:underline"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div>
        <img src={HeroImage} alt="Hero Section Image" className="w-full" />
      </div>
      <div className="flex w-full gap-10 items-center ml-3">
        <img src={Pharmacy} alt="Pharmacy Section Image" className="w-60" />
        <img src={Petcare} alt="Pet C=care Section Image" className="w-60" />
        <img src={Babycare} alt="Baby care Section Image" className="w-60" />
      </div>
      
      {/* Products */}
      <Products />  
    </>
  );
}
