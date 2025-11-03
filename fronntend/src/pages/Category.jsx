import React from "react";
import "../App.css";
import "../../utils/api"

import paan from "../assets/paan.avif";
import dairy from "../assets/dairy.avif";
import fruits from "../assets/fruits.avif";
import drinks from "../assets/cold_drinks.avif";
import snacks from "../assets/snacks.avif";
import breakfast from "../assets/breakfast.avif";
import sweet from "../assets/sweet.avif";
import bakery from "../assets/bakery.avif";
import tea from "../assets/tea.avif";
import home from "../assets/home.avif";
import atta from "../assets/atta.avif";
import masala from "../assets/masala.avif";
import sauces from "../assets/sauce.avif";
import meat from "../assets/meat.avif";
import organic from "../assets/organic.avif";
import baby from "../assets/baby.avif";
import pharma from "../assets/pharma.avif";
import cleaning from "../assets/cleaning.avif";
import personal from "../assets/personal.avif";
import pet from "../assets/pet.avif";

export default function Category() {
  const categories = [
    { image: paan },
    { image: dairy },
    { image: fruits },
    { image: drinks },
    { image: snacks },
    { image: breakfast },
    { image: sweet },
    { image: bakery },
    { image: tea },
    { image: atta },
    { image: masala },
    { image: sauces },
    { image: meat },
    { image: organic },
    { image: baby },
    { image: pharma },
    { image: cleaning },
    { image: home },
    { image: personal },
    { image: pet },
  ];

  return (
    <div className="products-container">
      <div className="products-grid">
        {categories.map((item, index) => (
          <div key={index} className="product-item">
            <img src={item.image} alt="product" className="product-image" />
          </div>
        ))}
      </div>
    </div>
  );
}
