import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Search, UserCircle, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Login from "../components/Login";
import api from "../../utils/api";
import "../App.css";

import logo from "../assets/logo.webp";

export default function Navbar() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const { getTotalItems, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const cartItemCount = getTotalItems();
  const cartTotalPrice = getTotalPrice();
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // fetch user address
  useEffect(() => {
    const fetchUserData = async() => {
      try {
        setLoadingUser(true);
        const response = await api.get("/user/profile");
        if (response.data.success) {
          setUserData(response.data.data);
        } 
      } catch (error) {
        setUserData({
          username: "Guest",
          email: "",
          contact_number: "",
          address: "India",
        })
      }
      finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // Real-time search as user types
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoadingSearch(true);
      try {
        const response = await api.get(
          `/products/search?query=${encodeURIComponent(searchQuery.trim())}`
        );
        if (response.data.success) {
          setSearchResults(response.data.data || []);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setLoadingSearch(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const handleSearchResultClick = (productId) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(`/product/${productId}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
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
              <p>
                {loadingUser
                  ? "Loading address..."
                  : userData?.address || "No address found"}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="navbar-search" ref={searchRef}>
            <form className="search-wrapper" onSubmit={handleSearchSubmit}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search here"
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowResults(true);
                  }
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="search-results-dropdown" ref={resultsRef}>
                {loadingSearch ? (
                  <div className="search-loading">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="search-results-header">
                      <span>
                        {searchResults.length} result
                        {searchResults.length !== 1 ? "s" : ""} found
                      </span>
                      <button
                        className="view-all-results-btn"
                        onClick={() => {
                          navigate(
                            `/search?q=${encodeURIComponent(
                              searchQuery.trim()
                            )}`
                          );
                          setShowResults(false);
                        }}
                      >
                        View All
                      </button>
                    </div>
                    <div className="search-results-list">
                      {searchResults.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="search-result-item"
                          onClick={() => handleSearchResultClick(product.id)}
                        >
                          <div className="search-result-image">
                            <img
                              src={
                                product.imageUrls && product.imageUrls[0]
                                  ? product.imageUrls[0]
                                  : "/placeholder.png"
                              }
                              alt={product.name}
                              onError={(e) => {
                                e.target.src = "/placeholder.png";
                              }}
                            />
                          </div>
                          <div className="search-result-details">
                            <h4 className="search-result-name">
                              {product.name}
                            </h4>
                            <p className="search-result-quantity">
                              {product.quantity}
                            </p>
                            <p className="search-result-price">
                              ₹{product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {searchResults.length > 5 && (
                        <div
                          className="search-result-item view-more-item"
                          onClick={() => {
                            navigate(
                              `/search?q=${encodeURIComponent(
                                searchQuery.trim()
                              )}`
                            );
                            setShowResults(false);
                          }}
                        >
                          <span className="view-more-text">
                            View all {searchResults.length} results →
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="search-no-results">No products found</div>
                ) : null}
              </div>
            )}
          </div>

          {/* Login & Cart */}
          <div className="navbar-right">
            {isAuthenticated() ? (
              <button
                className="account-btn"
                onClick={() => navigate("/account")}
                title="My Account"
              >
                <UserCircle size={20} />
                <span>Account</span>
              </button>
            ) : (
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                Login
              </button>
            )}

            <button
              className={`cart-btn ${
                cartItemCount > 0 ? "cart-btn-filled" : ""
              }`}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart size={24} className="cart-icon" strokeWidth={2} />
              {cartItemCount > 0 ? (
                <div className="cart-info">
                  <span className="cart-item-count">
                    {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
                  </span>
                  <span className="cart-total-price">
                    ₹{Math.round(cartTotalPrice)}
                  </span>
                </div>
              ) : (
                <span className="cart-empty-text">My Cart</span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      <Login showLogin={showLogin} setShowLogin={setShowLogin} />
    </>
  );
}
