import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import "../App.css";

export default function CartNotification({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto-hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="cart-notification">
      <div className="cart-notification-content">
        <CheckCircle className="cart-notification-icon" />
        <span className="cart-notification-text">{message}</span>
      </div>
    </div>
  );
}

