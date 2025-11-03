import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../utils/api";
import "../App.css";

export default function DairyProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    api
      .get("/products/tobacco")
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.data);
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
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
        <h5>Dairy, Bread & Eggs</h5>
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
              <div className="product-card" key={item.id}>
                <img
                  src={item.imageUrls[0]}
                  alt={item.name}
                  className="product-image"
                />
                <p className="product-name">{item.name}</p>
                <p className="product-weight">{item.quantity}</p>
                <div className="product-description">
                  <p className="product-price">₹{item.price}</p>
                  <button className="add-btn">ADD</button>
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
    </div>
  );
}
