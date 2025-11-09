import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "../../utils/api";
import { data } from "react-router-dom";

export default function ProductDescription() {
  const [productImg, setProductImg] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/product/:id")
      .then((res) => {
        if (res.data.success) {
          setProductImg(res.data.data);
        } else {
          setError(res.data.message);
        }
      })
      .catch((error) => {
        console.log("Error occured while fetching product details.");
        setError("Failed to fetch product details");
      });
  });

  return (
    <>
      <Navbar />
      <div className="product-desc">
        <img src="" alt="" />
      </div>
    </>
  );
}
