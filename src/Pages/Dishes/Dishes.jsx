import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../Config/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../../Config/firebase-config";
import Navbar from "../../Components/Navbar/Navbar";
import Cart from "../../Components/Cart/Cart";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { Star } from "@mui/icons-material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Swal from "sweetalert2"; // Import Swal library
import "./Dishes.css";

const Dishes = () => {
  const { restaurantId } = useParams();
  const [dishes, setDishes] = useState([]);
  const [userId, setUserId] = useState(null); // State to store the user ID
  const navigate = useNavigate();

  const user_id = auth.currentUser?.uid; // Access user ID only if user is authenticated
  console.log(user_id);
  useEffect(() => {
    setUserId(user_id);
  }, [user_id]);

  useEffect(() => {
    const getDishes = async () => {
      try {
        const q = query(
          collection(db, "Dishes"),
          where("res_id", "==", restaurantId)
        );
        const querySnapshot = await getDocs(q);
        const dishData = [];
        querySnapshot.forEach((doc) => {
          dishData.push({ id: doc.id, ...doc.data() });
        });
        setDishes(dishData);
      } catch (error) {
        console.error("Error getting dishes data: ", error);
        alert("Error getting dishes data");
      }
    };

    getDishes();
  }, [restaurantId]);

  // Function to handle Buy Now button click
  const handleBuyNow = (dishId) => {
    // If user is not logged in, show Swal message
    if (!userId) {
      Swal.fire({
        title: "Please Login",
        text: "Please login to buy the dish",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      // Redirect to the food_details page with the dish ID
      navigate(`/Dish/Dish_Details/${dishId}`);
    }
  };

  return (
    <>
      {/* Navbar and other HTML structure */}
      <Navbar />
      <div className="dish__container">
        <div className="dishes__container">
          <h1>Our Menu :</h1>
          <Grid container spacing={3}>
            {userId !== null ? (
              dishes.map((dish) => (
                <Grid item xs={12} sm={6} md={3} key={dish.id}>
                  <Card className="dish__card" elevation={4}>
                    <CardContent>
                      <img
                        src={dish.imageUrl}
                        alt={dish.dish_name}
                        className="dish__image"
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ marginRight: "10px" }}
                        >
                          {dish.dish_name}
                        </Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Star
                            style={{
                              color: "gold",
                              fontSize: "1rem",
                              marginRight: "5px",
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: "1.3rem" }}
                          >
                            {dish.ratings}
                          </Typography>
                        </div>
                      </div>
                      <Typography variant="body2" color="textSecondary">
                        Price:{" "}
                        <CurrencyRupeeIcon
                          sx={{ width: "10px", height: "10px" }}
                        />
                        {dish.price}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Reviews: {dish.reviews}
                      </Typography>
                      <Button
                        onClick={() => handleBuyNow(dish.id)}
                        variant="contained"
                        className="buy__button"
                        style={{
                          backgroundColor: "yellow",
                          color: "black",
                          marginTop: "10px", // Add margin-top
                        }}
                      >
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">Loading dishes...</Typography>
            )}
          </Grid>
        </div>
        {/* <div className="user__cart">
          <Cart />
        </div> */}
      </div>
    </>
  );
};

export default Dishes;
