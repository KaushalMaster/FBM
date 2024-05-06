import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import MenuCategory from "../../Components/MenuCategory/MenuCategory";
import Restaurants from "../../Components/Restaurants/Restaurants";
import Cart from "../../Components/Cart/Cart";
import "./Homepage.css";

const Homepage = () => {
  return (
    <>
      <Navbar />
      <MenuCategory />
      <Restaurants />
      <Restaurants />
      {/* <div className="con_three">
          <Cart />
        </div> */}
    </>
  );
};

export default Homepage;
