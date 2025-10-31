import React, { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Products from "./Products";
import DairyProducts from "./DairyProducts";
import "../App.css";

import logo from "../assets/logo.webp";
import HeroImage from "../assets/baner.webp";
import Pharmacy from "../assets/pharmacy.avif";
import Babycare from "../assets/babycare.avif";
import Petcare from "../assets/Pet-Care.avif";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      <header className="navbar-header">
        <nav className="navbar-container">
          {/* Logo Section */}
          <div className="navbar-left">
            <img src={logo} alt="Blinkit Logo" className="logo" />
            <div className="delivery-info">
              <h5>Delivery in 16 minutes</h5>
              <p>35, College Rd, Krishi Nagar, Nashik</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="navbar-search">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder='Search "paneer"'
                className="search-input"
              />
            </div>
          </div>

          {/* Login & Cart */}
          <div className="navbar-right">
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>

            <button className="cart-btn">
              <ShoppingCart size={22} className="cart-icon" />
              <span>My Cart</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="login-modal">
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ✕
            </button>
            <h2>Login to Blinkit</h2>

            <form onSubmit={handleSubmit} className="login-form">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>

            <div className="register-text">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="register-link"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div>
        <img src={HeroImage} alt="Hero Banner" className="hero-image" />
      </div>

      {/* Category Banners */}
      <div className="category-row">
        <img src={Pharmacy} alt="Pharmacy" className="category-image" />
        <img src={Petcare} alt="Petcare" className="category-image" />
        <img src={Babycare} alt="Babycare" className="category-image" />
      </div>

      {/* Products */}
      <Products />

      {/* Dairy Products Section */}
      <DairyProducts />
    </>
  );
}
