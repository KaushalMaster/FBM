import React, { useEffect, useState } from "react";
import "./MyDishes.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebase-config";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Star } from "@mui/icons-material";   

const MyDishes = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    getDishes();
  }, []);

  const getDishes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Dishes"));
      const dishData = [];
      querySnapshot.forEach((doc) => {
        dishData.push({ id: doc.id, ...doc.data() });
      });
      setDishes(dishData);
    } catch (error) {
      console.error("Error getting dish data: ", error);
      alert("Error getting dish data");
    }
  };
  return (
    <>
      <div className="dish_title">Dishes:</div>
      <div className="d_card_con">
        <div className="dish_card_container">
          <Swiper
            spaceBetween={50}
            slidesPerView={4}
            onSlideChange={() => console.log("slide change")}
            breakpoints={{
              // Adjust breakpoints as needed
              1024: {
                slidesPerView: 6,
                spaceBetween: 270,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 220,
              },
              425: {
                slidesPerView: 2,
                spaceBetween: 70,
              },
              375: {
                slidesPerView: 2,
                spaceBetween: 130,
              },
            }}
          >
            {dishes.map((dish, index) => (
              <SwiperSlide key={index} enableMouseEvents>
                <Link
                  to={`Dish/Dish_Details/${dish.id}`} // Pass dish ID as URL parameter
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Card className="dish_card">
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={dish.imageUrl}
                        alt={dish.dish_name}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h7"
                          component="div"
                          className="dish_name"
                        >
                          {dish.dish_name}
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="h7"
                          component="div"
                          className="dish_rating"
                        >
                          <Star />
                          {dish.ratings}
                        </Typography>
                        {/* <Typography className="dish_description">
                          {dish.description}
                        </Typography> */}
                        <Typography className="dish_price" id="font">
                          Price: <CurrencyRupeeIcon />
                          {dish.price}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default MyDishes;
