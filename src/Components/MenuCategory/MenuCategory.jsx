import React, { useState } from "react";
import "./MenuCategory.css";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Modal,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
} from "@mui/material"; // Import Modal and Card from Material-UI
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase-config";
import { Link } from "react-router-dom";

const MenuCategory = () => {
  const [selectedDish, setSelectedDish] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const menu = [
    // Your menu items...
    {
      name: "Snacks",
      image: "/assets/snacks.png",
    },
    {
      name: "Burger",
      image: "/assets/burger.png",
    },
    {
      name: "Pizza",
      image: "/assets/pizza.png",
    },
    {
      name: "Pasta",
      image: "/assets/pasta.png",
    },
    {
      name: "Ice-cream",
      image: "/assets/Icecream.png",
    },
    {
      name: "SoftDrink",
      image: "/assets/softdrink.png",
    },
    {
      name: "Snacks",
      image: "/assets/snacks.png",
    },
    {
      name: "Burger",
      image: "/assets/burger.png",
    },
    {
      name: "Pizza",
      image: "/assets/pizza.png",
    },
    {
      name: "Pasta",
      image: "/assets/pasta.png",
    },
    {
      name: "Ice-cream",
      image: "/assets/Icecream.png",
    },
    {
      name: "SoftDrink",
      image: "/assets/softdrink.png",
    },
  ];

  const handleMenuItemClick = (dishName) => {
    setSelectedDish(dishName);
    setOpenModal(true);
    fetchDishes(dishName);
  };

  // fetch the dishes based on the name of the category from the firebase
  const fetchDishes = async (dishName) => {
    console.log(dishName);
    // Fetch dishes from the firebase
    const dishesRef = await getDocs(collection(db, "Dishes"));
    const dishes = [];
    dishesRef.forEach((doc) => {
      dishes.push({ id: doc.id, ...doc.data() });
    });

    console.log(dishes, dishName);

    // get the dishes based on the dishName and store in one array
    const filteredDishes = dishes.filter((dish) =>
      dish.dish_name.includes(dishName)
    );
    setFilteredMenuItems(filteredDishes);

    console.log(filteredDishes);
  };

  return (
    <>
      <div className="menucategory_title">
        <span>Menu</span>Category:
      </div>
      <div className="items_container">
        <Swiper
          // spaceBetween={30}
          slidesPerView={5}
          breakpoints={{
            // when window width is >= 768px (tablet)
            1440: {
              slidesPerView: 9,
            },
            1024: {
              slidesPerView: 7,
            },
            768: {
              slidesPerView: 5,
            },
            // when window width is >= 576px (mobile)
            576: {
              slidesPerView: 4,
            },
            // when window width is >= 320px (small mobile)
            425: {
              slidesPerView: 2,
            },
            375: {
              slidesPerView: 2,
            },
          }}
        >
          <div className="menu_container">
            {menu.map((item, index) => (
              <SwiperSlide key={index} enableMouseEvents>
                <div
                  className="menu_item"
                  onClick={() => handleMenuItemClick(item.name)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="item_image"
                  />
                  <span className="item_title">{item.name}</span>
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
        <img src="/assets/rightarrow.png" alt="" className="right_arrow" />
      </div>
      <div className="res_cotainer">
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <div className="filtered_Restaurants">
            <Swiper
              spaceBetween={90}
              slidesPerView={3}
              direction="horizontal"
              breakpoints={{
                // when window width is >= 768px (tablet)
                768: {
                  slidesPerView: 2,
                },
                // when window width is >= 576px (mobile)
                576: {
                  slidesPerView: 1,
                },
                // when window width is >= 320px (small mobile)
                320: {
                  slidesPerView: 1,
                },
              }}
              onSlideChange={() => console.log("slide change")}
            >
              {filteredMenuItems.length === 0 ? (
                <Typography>No dishes found.</Typography>
              ) : (
                filteredMenuItems.map((dish) => (
                  <SwiperSlide key={dish.id} enableMouseEvents>
                    <Link
                      to={`/Dish/Dish_Details/${dish.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {/* Wrap CardActionArea with Link */}
                      <Card key={dish.id} className="card">
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            image={dish.imageUrl}
                            alt={dish.dish_name}
                            sx={{ width: 200 }}
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h7"
                              component="div"
                            >
                              {dish.dish_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Price: Rs.{dish.price}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Link>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default MenuCategory;
