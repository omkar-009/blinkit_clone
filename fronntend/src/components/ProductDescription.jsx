import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import api from "../../utils/api";

export default function ProductDescription() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/getproduct/${id}`);
        if (res.data.success) {
          // ✅ Parse image JSON
          const productData = res.data.data;
          if (productData.images) {
            try {
              productData.images = JSON.parse(productData.images);
            } catch (e) {
              console.error("Failed to parse images", e);
              productData.images = [];
            }
          }
          setProduct(productData);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <>
      <Navbar />
      <div className="product-desc flex gap-6 p-6">
        {/* Product Images */}
        <div className="product-image-container flex gap-3">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/uploads/${img}`}
                alt={product.name}
                className="product-image w-48 h-48 object-cover rounded-lg shadow"
              />
            ))
          ) : (
            <p>No image available</p>
          )}
        </div>

        {/* Product Description */}
        <div className="product-description">
          <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
          <p>{product.quantity}</p>
          <p className="font-bold">₹{product.price}</p>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="product-details p-6">
        <h4 className="text-xl font-semibold mb-2">Details:</h4>
        <p className="whitespace-pre-line">{product.details}</p>
      </div>
    </>
  );
}
