import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css"; // CSS file

export default function DairyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/getallproducts")
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.data);
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch products");
      });
  }, []);                        

  return (
    <div className="section">
      <div className="section-header">
        <h5>Dairy, Bread & Eggs</h5>
        <a href="#" className="see-all">
          see all
        </a>
      </div>

      {/* Product Cards */}
      <div className="product-container">
        {products.length > 0 ? (
          products.map((item) => (
            <div className="product-card" key={item.id}>
              <img src={item.imageUrls[0]} alt={item.name} className="product-image" />
              <p className="product-name">{item.name}</p>
              <p className="product-weight">{item.quantity}</p>
              <p className="product-price">₹{item.price}</p>
              <button className="add-btn">ADD</button>
            </div>
          ))
        ) : (
          <p className="loading-text">Loading products...</p>
        )}
      </div>
    </div>
  );
}
