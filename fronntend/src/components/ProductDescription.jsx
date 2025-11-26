import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Clock, ShoppingCart, Package, ChevronRight } from "lucide-react";
import Navbar from "./Navbar";
import api from "../../utils/api";
import "../App.css";

export default function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        
        const res = await api.get(`/products/getproduct/${id}`);
        
        if (res.data.success) {
          const productData = res.data.data;
          
          // API now returns images as array and imageUrls as full URLs
          // Ensure images array exists
          if (!productData.images || !Array.isArray(productData.images)) {
            productData.images = [];
          }
          
          setProduct(productData);
          
          // Fetch similar products from same category
          if (productData.category) {
            fetchSimilarProducts(productData.category, id);
          }
        } else {
          setError(res.data.message || "Failed to fetch product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchSimilarProducts = async (category, excludeId) => {
    try {
      // Use the new similar products API endpoint
      const res = await api.get("/products/similar", {
        params: {
          category: category,
          excludeId: excludeId,
        },
      });
      
      if (res.data.success && res.data.data) {
        setSimilarProducts(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching similar products:", err);
      // Fallback to category-based fetch if similar API fails
      try {
        let endpoint = "";
        switch (category) {
          case "dairy":
            endpoint = "/products/dairy";
            break;
          case "tobacco":
            endpoint = "/products/tobacco";
            break;
          case "snacks":
            endpoint = "/products/snacks";
            break;
          default:
            return;
        }
        
        const fallbackRes = await api.get(endpoint);
        if (fallbackRes.data.success) {
          const filtered = fallbackRes.data.data
            .filter((p) => p.id !== parseInt(excludeId))
            .slice(0, 4);
          setSimilarProducts(filtered);
        }
      } catch (fallbackErr) {
        console.error("Error in fallback similar products fetch:", fallbackErr);
      }
    }
  };

  const calculateDiscount = (price) => {
    // Assuming 10% discount for demo, you can adjust this logic
    const mrp = price * 1.1;
    const discount = ((mrp - price) / mrp) * 100;
    return { mrp: Math.round(mrp), discount: Math.round(discount) };
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      dairy: "Dairy, Bread & Eggs",
      tobacco: "Tobacco",
      snacks: "Snacks",
      mouth_freshners: "Mouth Fresheners",
      cold_drink: "Cold Drinks",
      candies: "Candies",
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-page-loading">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="product-page-error">
          <p className="text-red-500">{error}</p>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-page-error">
          <p>No product found</p>
        </div>
      </>
    );
  }

  const { mrp, discount } = calculateDiscount(product.price);
  
  // Use imageUrls if available (from API), otherwise construct from images array
  const getImageUrl = (imageIndex) => {
    if (product.imageUrls && product.imageUrls[imageIndex]) {
      return product.imageUrls[imageIndex];
    }
    if (product.images && product.images[imageIndex]) {
      return `http://localhost:5000/uploads/home_page_products/${product.images[imageIndex]}`;
    }
    return null;
  };
  
  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <>
      <Navbar />
      <div className="product-description-page">
        {/* Breadcrumbs */}
        <div className="product-breadcrumbs">
          <Link to="/home" className="breadcrumb-link">Home</Link>
          <ChevronRight size={16} className="breadcrumb-separator" />
          <span className="breadcrumb-text">
            {getCategoryDisplayName(product.category)}
          </span>
          <ChevronRight size={16} className="breadcrumb-separator" />
          <span className="breadcrumb-text">{product.name}</span>
        </div>

        <div className="product-main-container">
          {/* Left Column - Product Images */}
          <div className="product-images-section">
            {/* Main Product Image */}
            <div className="main-product-image">
              {images.length > 0 && getImageUrl(selectedImageIndex) ? (
                <img
                  src={getImageUrl(selectedImageIndex)}
                  alt={product.name}
                  className="main-image"
                />
              ) : (
                <div className="no-image-placeholder">No image available</div>
              )}
            </div>

            {/* Product Thumbnails */}
            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImageIndex === index ? "active" : ""}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={getImageUrl(index)}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Product Details Dropdown */}
            <div className="product-details-dropdown">
              <button
                className="details-toggle-btn"
                onClick={() => setShowDetails(!showDetails)}
              >
                <span>Product Details</span>
                {product.details && (
                  <span className="details-preview">
                    Flavour: {product.details.split("\n")[0] || "View more details"}
                  </span>
                )}
                {showDetails ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {showDetails && product.details && (
                <div className="details-content">
                  <pre className="details-text">{product.details}</pre>
                </div>
              )}
            </div>

            {/* Similar Products Section */}
            {similarProducts.length > 0 && (
              <div className="similar-products-section">
                <h3 className="similar-products-heading">Similar products</h3>
                <div className="similar-products-grid">
                  {similarProducts.map((item) => (
                    <div
                      key={item.id}
                      className="similar-product-card"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.imageUrls && item.imageUrls[0] && (
                        <img
                          src={item.imageUrls[0]}
                          alt={item.name}
                          className="similar-product-image"
                        />
                      )}
                      <p className="similar-product-name">{item.name}</p>
                      <p className="similar-product-price">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-quantity">{product.quantity}</p>

            {/* Pricing */}
            <div className="product-pricing">
              <div className="price-row">
                <span className="current-price">₹{product.price}</span>
                <span className="mrp-price">₹{mrp}</span>
                <span className="discount-badge">{discount}% OFF</span>
              </div>
              <p className="tax-info">(Inclusive of all taxes)</p>
            </div>

            {/* Add to Cart Button */}
            <button className="add-to-cart-btn">Add to cart</button>

            {/* Why shop from blinkit */}
            <div className="why-shop-section">
              <h3 className="why-shop-heading">Why shop from blinkit?</h3>
              <div className="why-shop-items">
                <div className="why-shop-item">
                  <div className="why-shop-icon">
                    <Clock size={24} />
                  </div>
                  <div className="why-shop-content">
                    <h4>Superfast Delivery</h4>
                    <p>
                      Get your order delivered to your doorstep at the earliest
                      from dark stores near you.
                    </p>
                  </div>
                </div>
                <div className="why-shop-item">
                  <div className="why-shop-icon">
                    <ShoppingCart size={24} />
                  </div>
                  <div className="why-shop-content">
                    <h4>Best Prices & Offers</h4>
                    <p>
                      Best price destination with offers directly from the
                      manufacturers.
                    </p>
                  </div>
                </div>
                <div className="why-shop-item">
                  <div className="why-shop-icon">
                    <Package size={24} />
                  </div>
                  <div className="why-shop-content">
                    <h4>Wide Assortment</h4>
                    <p>
                      Choose from 5000+ products across food, personal care,
                      household & other categories.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
