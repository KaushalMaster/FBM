import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../Config/firebase-config";
import { collection, where, query, getDocs } from "firebase/firestore";
import { AuthContext } from "../../AuthContext/AuthContext";
import Navbar from "../../Components/Navbar/Navbar";
import "./Run_Cart.css";

const Run_Cart = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // const userId = searchParams.get("userId");
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (currentUser) {
      getUserCartProducts();
    }
  }, []);

  // // Fetch the user's cart products based on the user ID
  const getUserCartProducts = async () => {
    try {
      const q = query(
        collection(db, "User_cart"),
        where("userId", "==", currentUser)
      );
      const querySnapshot = await getDocs(q);
      const cartData = [];
      querySnapshot.forEach((doc) => {
        cartData.push({ id: doc.id, ...doc.data() });
      });
      setCartItems(cartData);
    } catch (error) {
      console.error("Error fetching cart items: ", error);
      alert("Error fetching cart items");
    }
  };

  // console.log(cartItems);

  return (
    <>
      <h1 className="heading">Cart</h1>
      <div>
        <Navbar />
        {/* Display all the cart items */}
        {cartItems.map((item) => (
          <div key={item.id} className="card">
            <img src={item.dishImageUrl} alt={item.dishName} />
            <h2>{item.dishName}</h2>
            <p>Price: {item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Restaurant ID: {item.restaurantId}</p>
            <p>User ID: {item.userId}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Run_Cart;
