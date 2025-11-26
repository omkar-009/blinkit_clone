import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import "../App.css";
import { toast } from "react-toastify";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCart();

  const handleIncrease = (productId) => {
    increaseQuantity(productId);
    toast.success("Quantity increased");
  };

  const handleDecrease = (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      removeFromCart(productId);
      toast.success("Item removed from cart");
    } else {
      decreaseQuantity(productId);
      toast.success("Quantity decreased");
    }
  };

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const getImageUrl = (item) => {
    if (item.imageUrls && item.imageUrls[0]) {
      return item.imageUrls[0];
    }
    if (item.images && item.images[0]) {
      return `http://localhost:5000/uploads/home_page_products/${item.images[0]}`;
    }
    return null;
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice > 0 ? 20 : 0;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <div className="cart-container">
          {/* Cart Header */}
          <div className="cart-header">
            <h1 className="cart-title">My Cart ({totalItems} {totalItems === 1 ? "item" : "items"})</h1>
            {cartItems.length > 0 && (
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="empty-cart">
                <ShoppingBag size={64} className="empty-cart-icon" />
                <h2 className="empty-cart-title">Your cart is empty</h2>
                <p className="empty-cart-text">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link to="/home" className="shop-now-btn">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="cart-content">
                {/* Cart Items */}
                <div className="cart-items-section">
                  {cartItems.map((item) => {
                    const imageUrl = getImageUrl(item);
                    const cartQty = item.cartQuantity || 1; // Cart quantity (number of items)
                    const productQty = item.quantity || "N/A"; // Product quantity (e.g., "500 ml")
                    const itemTotal = (parseFloat(item.price) || 0) * cartQty;

                    return (
                      <div key={item.id} className="cart-item-card">
                        {/* Product Image */}
                        <div className="cart-item-image-container">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="cart-item-image"
                              onClick={() => navigate(`/product/${item.id}`)}
                            />
                          ) : (
                            <div className="cart-item-image-placeholder">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="cart-item-details">
                          <h3
                            className="cart-item-name"
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h3>
                          <p className="cart-item-quantity-text">{productQty}</p>
                          <p className="cart-item-price">₹{parseFloat(item.price) || 0}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="cart-item-quantity">
                          <button
                            className="quantity-btn decrease"
                            onClick={() => handleDecrease(item.id, cartQty)}
                          >
                            {cartQty <= 1 ? (
                              <Trash2 size={16} />
                            ) : (
                              <Minus size={16} />
                            )}
                          </button>
                          <span className="quantity-value">{cartQty}</span>
                          <button
                            className="quantity-btn increase"
                            onClick={() => handleIncrease(item.id)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="cart-item-total">
                          <p className="item-total-price">₹{itemTotal.toFixed(2)}</p>
                          <button
                            className="remove-item-btn"
                            onClick={() => handleRemove(item.id, item.name)}
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary */}
                <div className="cart-summary-section">
                  <div className="order-summary">
                    <h3 className="summary-title">Order Summary</h3>

                    <div className="summary-row">
                      <span>Item Total</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="summary-row">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee > 0 ? `₹${deliveryFee}` : "Free"}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total-row">
                      <span>Total</span>
                      <span className="total-price">₹{finalTotal.toFixed(2)}</span>
                    </div>

                    <button className="place-order-btn">
                      Place Order
                    </button>

                    <div className="delivery-info-summary">
                      <p className="delivery-time">
                        <strong>Delivery in 16 minutes</strong>
                      </p>
                      <p className="delivery-address">
                        35, College Rd, Krishi Nagar, Nashik
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}

