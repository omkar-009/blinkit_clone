import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartNotification from "../components/CartNotification";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../../utils/api";
import "../App.css";

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { addToCart, notification, hideNotification } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length >= 2) {
      fetchSearchResults(query);
    } else {
      setProducts([]);
      setError("");
    }
  }, [query]);

  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await api.get(
        `/products/search?query=${encodeURIComponent(searchQuery.trim())}`
      );
      if (response.data.success) {
        setProducts(response.data.data || []);
        if (response.data.data.length === 0) {
          setError("No products found");
        }
      } else {
        setError(response.data.message || "Failed to search products");
        setProducts([]);
      }
    } catch (err) {
      console.error("Error searching products:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to search products. Please try again."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />
      <div className="search-results-page">
        <div className="search-results-container">
          {/* Results Section */}
          <div className="search-results-content">
            {query && (
              <div className="search-results-info">
                <h2>
                  {loading
                    ? "Searching..."
                    : products.length > 0
                    ? `Found ${products.length} result${products.length !== 1 ? "s" : ""} for "${query}"`
                    : `No results found for "${query}"`}
                </h2>
              </div>
            )}

            {loading ? (
              <div className="search-loading-state">
                <div className="loading-spinner"></div>
                <p>Searching products...</p>
              </div>
            ) : error && products.length === 0 ? (
              <div className="search-error-state">
                <p>{error}</p>
                <button
                  className="back-to-home-btn"
                  onClick={() => navigate("/home")}
                >
                  Back to Home
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className="search-products-grid">
                {products.map((item) => (
                  <div
                    className="search-product-card"
                    key={item.id}
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="search-product-image-wrapper">
                      <img
                        src={
                          item.imageUrls && item.imageUrls[0]
                            ? item.imageUrls[0]
                            : "/placeholder.png"
                        }
                        alt={item.name}
                        className="search-product-image"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </div>
                    <div className="search-product-info">
                      <h3 className="search-product-name">{item.name}</h3>
                      <p className="search-product-quantity">{item.quantity}</p>
                      <div className="search-product-footer">
                        <p className="search-product-price">₹{item.price}</p>
                        <button
                          className="search-add-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="search-empty-state">
                <Search size={64} />
                <h3>No products found</h3>
                <p>Try searching with different keywords</p>
                <button
                  className="back-to-home-btn"
                  onClick={() => navigate("/home")}
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div className="search-empty-state">
                <Search size={64} />
                <h3>Start searching</h3>
                <p>Enter a product name to search</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Cart Notification */}
      <CartNotification
        message={notification.message}
        show={notification.show}
        onClose={hideNotification}
      />
    </>
  );
}

