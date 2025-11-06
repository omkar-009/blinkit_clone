import React, { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import Login from "../components/Login";
import "../App.css";

import logo from "../assets/logo.webp";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
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
    </>
  );
}
