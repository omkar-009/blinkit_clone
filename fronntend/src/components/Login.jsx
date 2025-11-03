import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function Login({ showLogin, setShowLogin }) {
  const navigate = useNavigate();
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
      const res = await api.post("/user/login", formData, { withCredentials: true });
      if (res.data.success) {
        alert("Login successful!");
        setShowLogin(false);
        navigate("/");
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
