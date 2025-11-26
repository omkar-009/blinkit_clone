import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import "../App.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Useful Links Section */}
        <div className="footer-section">
          <h4 className="footer-heading">Useful Links</h4>
          <div className="footer-links-grid">
            <div className="footer-links-column">
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">FAQs</a>
              <a href="#" className="footer-link">Security</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
            <div className="footer-links-column">
              <a href="#" className="footer-link">Partner</a>
              <a href="#" className="footer-link">Franchise</a>
              <a href="#" className="footer-link">Seller</a>
              <a href="#" className="footer-link">Warehouse</a>
              <a href="#" className="footer-link">Deliver</a>
              <a href="#" className="footer-link">Resources</a>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="footer-section footer-categories">
          <div className="categories-header">
            <h4 className="footer-heading">Categories</h4>
            <a href="#" className="see-all-link">see all</a>
          </div>
          <div className="categories-grid">
            <div className="category-column">
              <a href="#" className="footer-link">Recipes</a>
              <a href="#" className="footer-link">Bistro</a>
              <a href="#" className="footer-link">District</a>
              <a href="#" className="footer-link">Vegetables & Fruits</a>
              <a href="#" className="footer-link">Cold Drinks & Juices</a>
              <a href="#" className="footer-link">Bakery & Biscuits</a>
              <a href="#" className="footer-link">Dry Fruits</a>
              <a href="#" className="footer-link">Masala & Oil</a>
              <a href="#" className="footer-link">Paan Corner</a>
              <a href="#" className="footer-link">Pharma & Wellness</a>
              <a href="#" className="footer-link">Personal Care</a>
              <a href="#" className="footer-link">Kitchen & Dining</a>
              <a href="#" className="footer-link">Stationery Needs</a>
              <a href="#" className="footer-link">Print Store</a>
            </div>
            <div className="category-column">
              <a href="#" className="footer-link">Dairy & Breakfast</a>
              <a href="#" className="footer-link">Instant & Frozen Food</a>
              <a href="#" className="footer-link">Sweet Tooth</a>
              <a href="#" className="footer-link">Sauces & Spreads</a>
              <a href="#" className="footer-link">Organic & Premium</a>
              <a href="#" className="footer-link">Cleaning Essentials</a>
              <a href="#" className="footer-link">Pet Care</a>
              <a href="#" className="footer-link">Fashion & Accessories</a>
              <a href="#" className="footer-link">Books</a>
              <a href="#" className="footer-link">E-Gift Cards</a>
            </div>
            <div className="category-column">
              <a href="#" className="footer-link">Munchies</a>
              <a href="#" className="footer-link">Tea, Coffee & Milk Drinks</a>
              <a href="#" className="footer-link">Atta, Rice & Dal</a>
              <a href="#" className="footer-link">Chicken, Meat & Fish</a>
              <a href="#" className="footer-link">Baby Care</a>
              <a href="#" className="footer-link">Home Furnishing & Decor</a>
              <a href="#" className="footer-link">Beauty & Cosmetics</a>
              <a href="#" className="footer-link">Electronics & Electricals</a>
              <a href="#" className="footer-link">Toys & Games</a>
              <a href="#" className="footer-link">Rakhi Gifts</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          {/* Copyright */}
          <div className="copyright">
            <p>© Blink Commerce Private Limited, 2016-2025</p>
          </div>

          {/* App Download & Social Media */}
          <div className="footer-actions">
            <div className="download-section">
              <span className="download-text">Download App</span>
              <div className="app-buttons">
                <a href="#" className="app-store-btn">
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="currentColor">
                    <path d="M10 0L0 4v16l10 4 10-4V4L10 0zm0 2.4l7.2 2.88v13.44L10 21.6V2.4z"/>
                  </svg>
                  <div className="app-btn-text">
                    <span className="app-btn-small">Download on the</span>
                    <span className="app-btn-large">App Store</span>
                  </div>
                </a>
                <a href="#" className="app-store-btn">
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="currentColor">
                    <path d="M10 0L0 4v16l10 4 10-4V4L10 0zm0 2.4l7.2 2.88v13.44L10 21.6V2.4z"/>
                  </svg>
                  <div className="app-btn-text">
                    <span className="app-btn-small">GET IT ON</span>
                    <span className="app-btn-large">Google Play</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="social-icon" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="legal-disclaimer">
          <p>
            "Blinkit" is owned & managed by "Blink Commerce Private Limited" and is not related, 
            linked or interconnected in whatsoever manner or nature, to "GROFFR.COM" which is a 
            real estate services business operated by "Redstone Consultancy Services Private Limited".
          </p>
        </div>
      </div>
    </footer>
  );
}

