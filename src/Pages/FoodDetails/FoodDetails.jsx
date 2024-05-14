import React, { useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import "./FoodDetails.css";
import Swal from "sweetalert2";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../Config/firebase-config";
import RecommendedRestaurants from "../../Components/RecommendedRestaurants/RecommendedRestaurants";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MyDishes from "../../Components/MyDishes/MyDishes";

const FoodDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dishData, setDishData] = useState(null);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("dish details")
    const fetchDishData = async () => {
      try {
        const docRef = doc(db, "Dishes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDishData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchDishData();
  }, [id]);

  // Function to handle incrementing quantity
  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to handle decrementing quantity
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!dishData) {
    return <div>Loading...</div>;
  }

  const redirectHome = () => {
    Swal.fire({
      title: "Please login",
      text: "To view the dish content, please login first.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  };

  if (!user) {
    return redirectHome();
  }
  const data = {
    // dish_id: id,
    dish_name: dishData.dish_name,
    imageUrl: dishData.imageUrl,
    price: dishData.price,
    quantity: quantity,
    res_id: dishData.res_id,
    userId: user.uid,
  };

  // console.log(data);

  // Store the data to the user_cart in firebase
  const handleAddToCart = async () => {
    try {
      const docRef = await addDoc(collection(db, "User_cart"), data);
      console.log("Document written with ID: ", docRef.id);
      Swal.fire({
        icon: "success",
        title: "Added to cart",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="Main_container">
      <Navbar />
      <div className="food_details">
        <div className="food_img">
          <img src={dishData.imageUrl} alt="food" />
          {/* <img
            src="/assets/2 Signature Veg Wraps at 188 each.avif"
            alt="food"
          /> */}
        </div>
        <div className="food_info">
          <h2>{dishData.dish_name}</h2>
          <div className="food__description">
            <p>{dishData.description}</p>
          </div>

          <div className="content">
            <div className="price_rating">
              <h3>
                Price: <CurrencyRupeeIcon />
                {dishData.price}
              </h3>
              <span>⭐{dishData.ratings}</span>
            </div>

            <div className="quantity">
              <button className="btn_minus" onClick={handleDecrement}>
                -
              </button>
              <span>{quantity}</span>
              <button className="btn_plus" onClick={handleIncrement}>
                +
              </button>
            </div>
          </div>
          {/* Rating with stars and quantity */}

          {/*  */}
          <div className="btn_addtocart_con">
            <button className="btn_addtocart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="recommended_restaurants">
        <RecommendedRestaurants />
      </div>
      <div className="recommended_dishes">
        <MyDishes />
      </div>
      {/* <Cart /> */}
    </div>
  );
};

export default FoodDetails;
