import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartNotification from "../components/CartNotification";
import api from "../../utils/api";
import "../App.css";

export default function Snacks() {
  const navigate = useNavigate();
  const { addToCart, increaseQuantity, decreaseQuantity, cartItems, notification, hideNotification } = useCart();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    console.log("Fetching snacks products from API...");
    api
      .get("/products/snacks")
      .then((res) => {
        console.log("API Response:", res.data);
        if (res.data.success) {
          const productsData = res.data.data || [];
          console.log("Products received:", productsData);
          setProducts(productsData);
        } else {
          console.error("API returned error:", res.data.message);
          setError(res.data.message || "Failed to fetch products");
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        console.error("Error details:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || "Failed to fetch products. Please check if the backend server is running.");
      })
      .finally(() => {
        setLoading(false);
        setTimeout(checkScrollButtons, 100); // give time for rendering
      });
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 400); // recheck after smooth scroll
    }
  };

  const checkScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    const atStart = el.scrollLeft <= 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    setShowLeftArrow(!atStart);
    setShowRightArrow(!atEnd);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons(); // run once initially
    }
    return () => el && el.removeEventListener("scroll", checkScrollButtons);
  }, [products]);

  return (
    <div className="section">
      <div className="section-header">
        <h5>Snacks & Munchies</h5>
        <a href="#" className="see-all">
          see all
        </a>
      </div>

      <div className="slider-wrapper" style={{ position: "relative" }}>
        {/* Left Arrow */}
        {showLeftArrow && (
          <button className="scroll-btn left" onClick={() => scroll("left")}>
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Product Cards */}
        <div
          className="product-container"
          ref={scrollRef}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            gap: "15px",
          }}
        >
          {loading ? (
            <p className="loading-text">Loading products...</p>
          ) : error ? (
            <p className="error-text" style={{ color: "red" }}>
              {error}
            </p>
          ) : products.length > 0 ? (
            products.map((item) => (
              <div 
                className="product-card" 
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : "/placeholder.png"}
                  alt={item.name}
                  className="product-image"
                  onError={(e) => {
                    console.error("Image failed to load:", item.imageUrls?.[0]);
                    e.target.src = "/placeholder.png";
                  }}
                />
                <p className="product-name">{item.name}</p>
                <p className="product-weight">{item.quantity}</p>
                <div className="product-description">
                  <p className="product-price">₹{item.price}</p>
                  <button 
                    className="add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                  >
                    ADD
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button className="scroll-btn right" onClick={() => scroll("right")}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Cart Notification */}
      <CartNotification
        message={notification.message}
        show={notification.show}
        onClose={hideNotification}
      />
    </div>
  );
}
