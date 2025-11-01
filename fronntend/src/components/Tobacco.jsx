import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../utils/api";
import "../App.css";

export default function TobaccoProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      api.get("/products/tobacco")
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
      });
  }, []);

  return (
    <div className="section">
      <div className="section-header">
        <h5>Rolling paper & tobacco</h5>
        <a href="#" className="see-all">
          see all
        </a>
      </div>

      {/* Product Card */}
      <div className="product-container">
        {loading ? (
          <p className="loading-text">Loading products...</p>
        ) : error ? (
          <p className="error-text" style={{ color: "red" }}>{error}</p>
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
    </div>
  );
}
