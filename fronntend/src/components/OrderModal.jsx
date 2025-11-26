import React from "react";
import { X, CheckCircle, Package, Clock, MapPin, User, Mail, Phone } from "lucide-react";
import "../App.css";

export default function OrderModal({ isOpen, onClose, orderSummary, userData, loadingUser }) {
  if (!isOpen) return null;

  // Default values if user data is not available
  const displayAddress = userData?.address || "35, College Rd, Krishi Nagar, Nashik";
  const displayName = userData?.username || "Guest";
  const displayEmail = userData?.email || "";
  const displayContact = userData?.contact_number || "";

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="order-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="order-modal-content">
          {/* Success Icon */}
          <div className="order-success-icon">
            <CheckCircle size={64} />
          </div>

          {/* Order Placed Title */}
          <h2 className="order-modal-title">Order Placed Successfully!</h2>
          <p className="order-modal-subtitle">Your order has been confirmed</p>

          {/* Order Summary */}
          <div className="order-modal-summary">
            <div className="order-summary-section">
              <h3 className="order-summary-heading">Order Summary</h3>

              <div className="order-summary-row">
                <span>Item Total</span>
                <span>₹{orderSummary.itemTotal?.toFixed(2) || "0.00"}</span>
              </div>

              <div className="order-summary-row">
                <span>Delivery Fee</span>
                <span>₹{orderSummary.deliveryFee || "0.00"}</span>
              </div>

              <div className="order-summary-divider"></div>

              <div className="order-summary-row order-total-row">
                <span>Total Amount</span>
                <span className="order-total-amount">
                  ₹{orderSummary.total?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="order-delivery-info">
              <div className="order-delivery-item">
                <Clock size={20} />
                <div>
                  <p className="order-delivery-label">Estimated Delivery</p>
                  <p className="order-delivery-value">16 minutes</p>
                </div>
              </div>

              <div className="order-delivery-item">
                <MapPin size={20} />
                <div>
                  <p className="order-delivery-label">Delivery Address</p>
                  <p className="order-delivery-value">
                    {displayAddress}
                  </p>
                </div>
              </div>

              {displayName && displayName !== "Guest" && (
                <div className="order-delivery-item">
                  <User size={20} />
                  <div>
                    <p className="order-delivery-label">Customer Name</p>
                    <p className="order-delivery-value">{displayName}</p>
                  </div>
                </div>
              )}

              {displayEmail && (
                <div className="order-delivery-item">
                  <Mail size={20} />
                  <div>
                    <p className="order-delivery-label">Email</p>
                    <p className="order-delivery-value">{displayEmail}</p>
                  </div>
                </div>
              )}

              {displayContact && (
                <div className="order-delivery-item">
                  <Phone size={20} />
                  <div>
                    <p className="order-delivery-label">Contact Number</p>
                    <p className="order-delivery-value">{displayContact}</p>
                  </div>
                </div>
              )}

              <div className="order-delivery-item">
                <Package size={20} />
                <div>
                  <p className="order-delivery-label">Items</p>
                  <p className="order-delivery-value">
                    {orderSummary.itemCount || 0} {orderSummary.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="order-modal-actions">
            <button className="order-modal-btn-primary" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

