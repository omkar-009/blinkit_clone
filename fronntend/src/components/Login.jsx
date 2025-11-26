import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login({ showLogin, setShowLogin, onLoginSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success(result.message || "Login successful!");
        setShowLogin(false);
        
        // Check if we need to redirect back to cart
        const redirectTo = localStorage.getItem("blinkit_redirect_to");
        if (redirectTo === "cart") {
          localStorage.removeItem("blinkit_redirect_to");
          navigate("/cart");
        } else {
          navigate("/home");
        }
        
        // Call onLoginSuccess callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(result.message || "Invalid credentials");
        toast.error(result.message || "Invalid credentials");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!showLogin) return null;

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={() => setShowLogin(false)}>
          ✕
        </button>
        <h2>Login to Blinkit</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email or Contact Number</label>
          <input
            type="text"
            name="identifier"
            placeholder="Enter your email or contact number"
            value={formData.identifier}
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

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
  );
}
