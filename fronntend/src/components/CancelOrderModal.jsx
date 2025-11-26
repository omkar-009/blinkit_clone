import React from "react";
import { X, AlertTriangle, Info } from "lucide-react";
import "../App.css";

export default function CancelOrderModal({ isOpen, onClose, onConfirm, orderId, orderData }) {
  if (!isOpen) return null;

  const cancellationFee = 50;
  const orderAmount = orderData ? parseFloat(orderData.total_amount) : 0;
  const refundAmount = Math.max(0, orderAmount - cancellationFee);

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cancel-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="cancel-modal-content">
          {/* Warning Icon */}
          <div className="cancel-warning-icon">
            <AlertTriangle size={64} />
          </div>

          {/* Title */}
          <h2 className="cancel-modal-title">Cancel Order?</h2>

          {/* Disclaimer */}
          <div className="cancel-disclaimer">
            <Info size={20} />
            <div className="disclaimer-content">
              <h3>Important Information</h3>
              <ul>
                <li>A cancellation fee of <strong>₹{cancellationFee}</strong> will be charged.</li>
                <li>The remaining amount will be refunded to your account.</li>
                <li>This action cannot be undone.</li>
                <li>Refund will be processed within 5-7 business days.</li>
              </ul>
            </div>
          </div>

          {/* Fee Details */}
          <div className="cancel-fee-details">
            <div className="fee-row">
              <span>Order Amount</span>
              <span>₹{orderAmount.toFixed(2)}</span>
            </div>
            <div className="fee-row">
              <span>Cancellation Fee</span>
              <span className="fee-amount">-₹{cancellationFee}</span>
            </div>
            <div className="fee-divider"></div>
            <div className="fee-row total-fee-row">
              <span>Refund Amount</span>
              <span className="refund-amount">₹{refundAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cancel-modal-actions">
            <button className="cancel-btn-secondary" onClick={onClose}>
              Keep Order
            </button>
            <button className="cancel-btn-primary" onClick={onConfirm}>
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

