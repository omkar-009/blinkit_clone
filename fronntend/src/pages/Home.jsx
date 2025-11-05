import React, { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Categories from "./Category";
import DairyProducts from "./DairyProducts";
import TobaccoProducts from "./Tobacco";
import SnacksProducts from "./Snacks";
import "../App.css";

import logo from "../assets/logo.webp";
import HeroImage from "../assets/baner.webp";
import Pharmacy from "../assets/pharmacy.avif";
import Babycare from "../assets/babycare.avif";
import Petcare from "../assets/Pet-Care.avif";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

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
      <Login showLogin={showLogin} setShowLogin={setShowLogin} />

      {/* Hero Section Image*/}
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
      <Categories />

      {/* Dairy Products Section */}
      <DairyProducts />

      {/* Tobacco Products Section */}
      <TobaccoProducts />

      {/* Snacks Products Section */}
      <SnacksProducts />
    </>
  );
}
