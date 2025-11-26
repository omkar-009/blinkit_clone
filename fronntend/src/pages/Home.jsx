import React, { useState } from "react";
// import { ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import Login from "../components/Login";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Categories from "./Category";
import DairyProducts from "./DairyProducts";
import TobaccoProducts from "./Tobacco";
import SnacksProducts from "./Snacks";
import "../App.css";

// import logo from "../assets/logo.webp";
import HeroImage from "../assets/baner.webp";
import Pharmacy from "../assets/pharmacy.avif";
import Babycare from "../assets/babycare.avif";
import Petcare from "../assets/Pet-Care.avif";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section Image*/}
      <div>
        <img src={HeroImage} alt="Hero Banner" className="hero-image" />
      </div>

      {/* Category Banners */}
      <div className="category-row">
        <img src={Pharmacy} alt="Pharmacy" className="category-image" />
        <img src={Petcare} alt="Petcare" className="category-image" />
        <img src={Babycare} alt="Babycare" className="category-image" />
      </div>

      {/* Products */}
      <Categories />

      {/* Dairy Products Section */}
      <DairyProducts />

      {/* Tobacco Products Section */}
      <TobaccoProducts />

      {/* Snacks Products Section */}
      <SnacksProducts />

      {/* Footer */}
      <Footer />
    </>
  );
}
