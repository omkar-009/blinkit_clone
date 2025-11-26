import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Package, X, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import CancelOrderModal from "../components/CancelOrderModal";
import api from "../../utils/api";
import "../App.css";

export default function OrderHistory() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/home");
      return;
    }
    fetchOrderHistory();
  }, [isAuthenticated, navigate]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/orders");
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch order history");
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError(err.response?.data?.message || "Failed to fetch order history");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (order) => {
    setCancelOrderId(order.order_id);
    setCancelOrderData(order);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelOrderId) return;

    try {
      const response = await api.put(`/orders/${cancelOrderId}/cancel`);
      if (response.data.success) {
        // Refresh order history
        await fetchOrderHistory();
        setShowCancelModal(false);
        setCancelOrderId(null);
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      case "preparing":
        return "#3b82f6";
      case "out_for_delivery":
        return "#8b5cf6";
      case "delivered":
        return "#059669";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={20} />;
      case "cancelled":
        return <X size={20} />;
      default:
        return <Clock size={20} />;
    }
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

  const getImageUrl = (item) => {
    if (item.product_images) {
      try {
        const images = JSON.parse(item.product_images);
        if (images && images.length > 0) {
          return `http://localhost:5000/uploads/home_page_products/${images[0]}`;
        }
      } catch (e) {
        // If not JSON, treat as single filename
        return `http://localhost:5000/uploads/home_page_products/${item.product_images}`;
      }
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <div className="order-history-page">
        <div className="order-history-container">
          <h1 className="order-history-title">Order History</h1>

          {loading ? (
            <div className="loading-state">
              <p>Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={48} />
              <p>{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <Package size={64} />
              <h2>No orders yet</h2>
              <p>You haven't placed any orders yet.</p>
              <button className="shop-now-btn" onClick={() => navigate("/home")}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.order_id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-number">Order #{order.order_number}</h3>
                      <p className="order-date">{formatDate(order.created_at)}</p>
                    </div>
                    <div
                      className="order-status"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {getStatusIcon(order.status)}
                      <span className="status-text">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="order-items-section">
                    <h4 className="items-title">Items ({order.items?.length || 0})</h4>
                    <div className="order-items-list">
                      {order.items?.map((item) => (
                        <div key={item.item_id} className="order-item-row">
                          <div className="order-item-image">
                            {getImageUrl(item) ? (
                              <img src={getImageUrl(item)} alt={item.product_name} />
                            ) : (
                              <div className="image-placeholder">No Image</div>
                            )}
                          </div>
                          <div className="order-item-details">
                            <p className="item-name">{item.product_name}</p>
                            <p className="item-quantity">
                              {item.product_quantity} × {item.cart_quantity}
                            </p>
                          </div>
                          <div className="order-item-price">
                            ₹{parseFloat(item.item_total).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-summary-section">
                    <div className="summary-row">
                      <span>Item Total</span>
                      <span>₹{parseFloat(order.item_total).toFixed(2)}</span>
                    </div>
                    {order.delivery_fee > 0 && (
                      <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹{parseFloat(order.delivery_fee).toFixed(2)}</span>
                      </div>
                    )}
                    {order.cancellation_fee > 0 && (
                      <div className="summary-row cancellation-fee">
                        <span>Cancellation Fee</span>
                        <span>-₹{parseFloat(order.cancellation_fee).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="summary-divider"></div>
                    <div className="summary-row total-row">
                      <span>Total Amount</span>
                      <span className="total-amount">
                        ₹{parseFloat(order.total_amount - (order.cancellation_fee || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {order.delivery_address && (
                    <div className="order-address">
                      <MapPin size={18} />
                      <span>{order.delivery_address}</span>
                    </div>
                  )}

                  {order.status !== "cancelled" && order.status !== "delivered" && (
                    <div className="order-actions">
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleCancelClick(order)}
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelOrderId(null);
          setCancelOrderData(null);
        }}
        onConfirm={handleCancelConfirm}
        orderId={cancelOrderId}
        orderData={cancelOrderData}
      />
    </>
  );
}

