import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "" });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedCart = window.localStorage.getItem("blinkit_cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("blinkit_cart", JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Show notification
  const showNotification = (message) => {
    setNotification({ show: true, message });
  };

  // Hide notification
  const hideNotification = () => {
    setNotification({ show: false, message: "" });
  };

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If item exists, increase cart quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      } else {
        // If new item, add with cartQuantity 1, preserve product quantity
        return [
          ...prevItems,
          {
            ...product,
            cartQuantity: 1,
          },
        ];
      }
    });
    // Notification disabled - don't show toast/notification
    // showNotification("Product added to cart");
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, cartQuantity: quantity } : item
      )
    );
  };

  // Increase quantity by 1
  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, cartQuantity: (item.cartQuantity || 1) + 1 }
          : item
      )
    );
  };

  // Decrease quantity by 1
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const currentQty = item.cartQuantity || 1;
          if (currentQty <= 1) {
            return null; // Will be filtered out
          }
          return { ...item, cartQuantity: currentQty - 1 };
        }
        return item;
      }).filter(Boolean)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.cartQuantity || 1), 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = item.cartQuantity || 1;
      return total + price * qty;
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    notification,
    hideNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
