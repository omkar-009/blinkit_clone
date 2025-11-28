import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Package, Clock, LogOut, History } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../../utils/api";
import "../App.css";

export default function Account() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact_number: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/home");
      return;
    }
    fetchUserProfile();
    fetchOrderHistory();
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/profile");
      if (response.data.success) {
        setUserData(response.data.data);
        setFormData({
          username: response.data.data.username || "",
          email: response.data.data.email || "",
          contact_number: response.data.data.contact_number || "",
          address: response.data.data.address || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      setLoadingOrders(true);
      const response = await api.get("/orders");
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setError("");
      const response = await api.put("/user/profile", formData);
      if (response.data.success) {
        setUserData(response.data.data);
        setEditing(false);
        // Update auth context
        if (window.location.reload) {
          // Optionally reload to refresh auth context
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      username: userData?.username || "",
      email: userData?.email || "",
      contact_number: userData?.contact_number || "",
      address: userData?.address || "",
    });
    setEditing(false);
    setError("");
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="account-page">
          <div className="loading-state">
            <p>Loading account information...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="account-page">
        <div className="account-container">
          <h1 className="account-title">My Account</h1>

          {error && (
            <div className="error-message" style={{ color: "#ef4444", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {/* Profile Section */}
          <div className="account-section">
            <div className="section-header">
              <h2 className="section-title">Profile Information</h2>
              {!editing ? (
                <button className="edit-btn" onClick={() => setEditing(true)}>
                  <Edit2 size={18} />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    <Save size={18} />
                    <span>Save</span>
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>
                  <User size={18} />
                  Username
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{userData?.username || "N/A"}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{userData?.email || "N/A"}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  <Phone size={18} />
                  Contact Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{userData?.contact_number || "N/A"}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={18} />
                  Delivery Address
                </label>
                {editing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input form-textarea"
                    rows="3"
                    placeholder="Enter your delivery address"
                  />
                ) : (
                  <p className="form-value">{userData?.address || "No address set"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="account-section">
            <div className="section-header">
              <h2 className="section-title">Order History</h2>
              <button className="view-all-btn" onClick={() => navigate("/orders")}>
                <History size={18} />
                <span>View All</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="loading-state">
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <p>No orders yet</p>
                <button className="shop-now-btn" onClick={() => navigate("/home")}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-preview">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.order_id} className="order-preview-card">
                    <div className="order-preview-header">
                      <div>
                        <h4>Order #{order.order_number}</h4>
                        <p className="order-date">{formatDate(order.created_at)}</p>
                      </div>
                      <div className={`order-status-badge status-${order.status}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="order-preview-summary">
                      <span>{order.item_count || 0} items</span>
                      <span className="order-total">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    <button
                      className="view-order-btn"
                      onClick={() => navigate("/orders")}
                    >
                      View Details
                    </button>
                  </div>
                ))}
                {orders.length > 5 && (
                  <button className="view-all-orders-btn" onClick={() => navigate("/orders")}>
                    View All {orders.length} Orders
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Logout Section */}
          <div className="account-section">
            <button className="logout-account-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

