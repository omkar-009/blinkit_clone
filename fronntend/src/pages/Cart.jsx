import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import OrderModal from "../components/OrderModal";
import Login from "../components/Login";
import api from "../../utils/api";
import "../App.css";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const handleIncrease = (productId) => {
    increaseQuantity(productId);
  };

  const handleDecrease = (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      removeFromCart(productId);
    } else {
      decreaseQuantity(productId);
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        const response = await api.get("/user/profile");
        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // User might not be logged in, set default values
        setUserData({
          username: "Guest",
          email: "",
          contact_number: "",
          address: "35, College Rd, Krishi Nagar, Nashik",
        });
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePlaceOrder = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Save cart to localStorage before redirecting
      try {
        localStorage.setItem("blinkit_cart", JSON.stringify(cartItems));
        localStorage.setItem("blinkit_redirect_to", "cart");
        console.log("Cart saved before login redirect");
      } catch (error) {
        console.error("Error saving cart:", error);
      }
      // Show login modal
      setShowLogin(true);
      return;
    }

    // User is authenticated, proceed with order
    try {
      setLoadingUser(true);
      const response = await api.get("/user/profile");
      let currentUserData = userData;
      
      if (response.data.success) {
        currentUserData = response.data.data;
        setUserData(currentUserData);
      } else if (!currentUserData) {
        currentUserData = {
          username: "Guest",
          email: "",
          contact_number: "",
          address: "35, College Rd, Krishi Nagar, Nashik",
        };
      }

      // Create order in database
      const orderData = {
        items: cartItems,
        itemTotal: totalPrice,
        deliveryFee: deliveryFee,
        totalAmount: finalTotal,
        userData: currentUserData,
      };

      const orderResponse = await api.post("/orders", orderData);
      
      if (orderResponse.data.success) {
        setShowOrderModal(true);
        // Order saved successfully
      } else {
        throw new Error(orderResponse.data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        localStorage.setItem("blinkit_cart", JSON.stringify(cartItems));
        localStorage.setItem("blinkit_redirect_to", "cart");
        setShowLogin(true);
      } else {
        alert(error.response?.data?.message || error.message || "Failed to place order. Please try again.");
      }
    } finally {
      setLoadingUser(false);
    }
  };

  // Handle login success - restore cart if needed
  useEffect(() => {
    if (isAuthenticated() && localStorage.getItem("blinkit_redirect_to") === "cart") {
      // User logged in, cart is already in localStorage from CartContext
      localStorage.removeItem("blinkit_redirect_to");
      setShowLogin(false);
    }
  }, [isAuthenticated]);

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    clearCart(); // Clear cart when modal is closed
    navigate("/home");
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
                            onClick={() => handleRemove(item.id)}
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

                    <button className="place-order-btn" onClick={handlePlaceOrder}>
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

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={handleCloseOrderModal}
        orderSummary={{
          itemTotal: totalPrice,
          deliveryFee: deliveryFee,
          total: finalTotal,
          itemCount: totalItems,
        }}
        userData={userData}
        loadingUser={loadingUser}
      />

      {/* Login Modal */}
      <Login 
        showLogin={showLogin} 
        setShowLogin={setShowLogin}
        onLoginSuccess={() => {
          setShowLogin(false);
          // Cart is already saved in localStorage, will be restored automatically
        }}
      />
    </>
  );
}

