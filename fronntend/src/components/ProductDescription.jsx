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
  const [imageError, setImageError] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        
        const res = await api.get(`/products/getproduct/${id}`);
        
        if (res.data.success) {
          const productData = res.data.data;
          
          // Debug: Log the product data to check image structure
          console.log("Product data received:", productData);
          console.log("Images (raw):", productData.images);
          console.log("ImageUrls (raw):", productData.imageUrls);
          
          // Handle images - could be string (JSON) or array
          let imageFilenames = [];
          if (productData.images) {
            if (typeof productData.images === 'string') {
              try {
                imageFilenames = JSON.parse(productData.images);
              } catch (e) {
                console.error("Failed to parse images string:", e);
                imageFilenames = [];
              }
            } else if (Array.isArray(productData.images)) {
              imageFilenames = productData.images;
            }
          }
          
          // Handle imageUrls - should be array of full URLs
          let imageUrls = [];
          if (productData.imageUrls) {
            if (Array.isArray(productData.imageUrls)) {
              imageUrls = productData.imageUrls;
            } else if (typeof productData.imageUrls === 'string') {
              try {
                imageUrls = JSON.parse(productData.imageUrls);
              } catch (e) {
                imageUrls = [];
              }
            }
          }
          
          // If imageUrls is empty but we have filenames, construct URLs
          if (imageUrls.length === 0 && imageFilenames.length > 0) {
            imageUrls = imageFilenames.map((filename) => 
              `http://localhost:5000/uploads/home_page_products/${filename}`
            );
          }
          
          console.log("Processed imageFilenames:", imageFilenames);
          console.log("Processed imageUrls:", imageUrls);
          
          // Update product data with processed arrays
          productData.images = imageFilenames;
          productData.imageUrls = imageUrls;
          
          setProduct(productData);
          setImageError(false);
          setSelectedImageIndex(0); // Reset to first image
          
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
      setLoadingSimilar(true);
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
          case "mouth_freshners":
            endpoint = "/products/snacks"; // Fallback to snacks if no specific endpoint
            break;
          default:
            endpoint = "/products/snacks"; // Default fallback
            break;
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
        setSimilarProducts([]);
      }
    } finally {
      setLoadingSimilar(false);
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
    console.log(`Getting image URL for index ${imageIndex}`);
    console.log("product.imageUrls:", product.imageUrls);
    console.log("product.images:", product.images);
    
    // First try imageUrls array (full URLs from API)
    if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > imageIndex) {
      const url = product.imageUrls[imageIndex];
      console.log(`Using imageUrls[${imageIndex}]:`, url);
      return url;
    }
    
    // Fallback to constructing URL from images array (filenames)
    if (product.images && Array.isArray(product.images) && product.images.length > imageIndex) {
      const filename = product.images[imageIndex];
      const url = `http://localhost:5000/uploads/home_page_products/${filename}`;
      console.log(`Constructing URL from images[${imageIndex}]:`, url);
      return url;
    }
    
    console.log(`No image found for index ${imageIndex}`);
    return null;
  };
  
  // Get images count - use the length of whichever array exists and has items
  const imagesCount = (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0)
    ? product.imageUrls.length
    : (product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images.length
      : 0);
  
  console.log("Total images count:", imagesCount);
  
  // Create array for mapping thumbnails
  const imagesArray = Array.from({ length: imagesCount }, (_, i) => i);

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
              {imagesCount > 0 && !imageError ? (
                (() => {
                  const imageUrl = getImageUrl(selectedImageIndex);
                  console.log(`Rendering main image ${selectedImageIndex}:`, imageUrl);
                  return imageUrl ? (
                    <img
                      key={`main-${selectedImageIndex}-${imageUrl}`}
                      src={imageUrl}
                      alt={product.name}
                      className="main-image"
                      onLoad={() => {
                        console.log("Image loaded successfully:", imageUrl);
                        setImageError(false);
                      }}
                      onError={(e) => {
                        console.error("Image failed to load:", imageUrl);
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">No image URL available</div>
                  );
                })()
              ) : (
                <div className="no-image-placeholder">
                  {imageError ? "Failed to load image" : "No images found"}
                </div>
              )}
            </div>

            {/* Product Thumbnails */}
            {imagesCount > 1 && (
              <div className="product-thumbnails">
                {imagesArray.map((_, index) => {
                  const thumbUrl = getImageUrl(index);
                  return (
                    <div
                      key={index}
                      className={`thumbnail ${selectedImageIndex === index ? "active" : ""}`}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setImageError(false); // Reset error when changing image
                      }}
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={`${product.name} ${index + 1}`}
                          onError={(e) => {
                            console.error("Thumbnail failed to load:", thumbUrl);
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="thumbnail-placeholder">No img</div>
                      )}
                    </div>
                  );
                })}
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

        {/* Similar Products Section - At Bottom */}
        {product.category && (
          <div className="similar-products-section-bottom">
            <h3 className="similar-products-heading">Similar products</h3>
            {loadingSimilar ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                Loading similar products...
              </div>
            ) : similarProducts.length > 0 ? (
              <div className="similar-products-grid-bottom">
                {similarProducts.map((item) => (
                  <div
                    key={item.id}
                    className="similar-product-card-bottom"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.imageUrls && item.imageUrls[0] ? (
                      <img
                        src={item.imageUrls[0]}
                        alt={item.name}
                        className="similar-product-image-bottom"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="similar-product-image-bottom" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f5f5f5",
                        color: "#999",
                        fontSize: "12px"
                      }}>
                        No Image
                      </div>
                    )}
                    <p className="similar-product-name-bottom">{item.name}</p>
                    <p className="similar-product-price-bottom">₹{item.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                No similar products found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
