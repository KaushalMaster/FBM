// import React, { useEffect, useState } from "react";
// import "./Restaurants.css";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Link } from "react-router-dom";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../Config/firebase-config";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';

// const Restaurants = () => {
//   const [restaurants, setRestaurants] = useState([]);

//   useEffect(() => {
//     getRestaurants();
//   }, []);

//   const getRestaurants = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "Restaurants"));
//       const restaurantData = [];
//       querySnapshot.forEach((doc) => {
//         restaurantData.push({ id: doc.id, ...doc.data() });
//       });
//       setRestaurants(restaurantData);
//     } catch (error) {
//       console.error("Error getting restaurant data: ", error);
//       alert("Error getting restaurant data");
//     }
//   };

//   return (
//     <>
//       <div className="title" style={{ color: "red" }}>
//         Restaurants
//       </div>
//       <div className="card_container">
//         <Swiper
//           spaceBetween={30}
//           slidesPerView={4}
//           onSlideChange={() => console.log("slide change")}
//         >
//           <img src="/assets/rightarrow.png" alt="" className="left_arrow" />
//           {restaurants.map((restaurant, index) => (
//             <SwiperSlide key={index} enableMouseEvents>
//               <Link
//                 to={`/dishes/${restaurant.id}`} // Pass restaurant ID as URL parameter
//                 style={{ textDecoration: "none", color: "black" }}
//               >
//                 <Card className="card">
//                   <CardMedia
//                     component="img"
//                     height="140"
//                     image={restaurant.imgUrl}
//                     alt={restaurant.name}
//                   />
//                   <CardContent>
//                     <Typography gutterBottom variant="h5" component="div">
//                       {restaurant.name}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Link>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </>
//   );
// };

// export default Restaurants;

import React, { useEffect, useState } from "react";
import "./Restaurants.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebase-config";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Star } from "@mui/icons-material";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getRestaurants();
  }, []);

  const getRestaurants = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Restaurants"));
      const restaurantData = [];
      querySnapshot.forEach((doc) => {
        restaurantData.push({ id: doc.id, ...doc.data() });
      });
      setRestaurants(restaurantData);
      console.log(restaurantData);
    } catch (error) {
      console.error("Error getting restaurant data: ", error);
      // alert("Error getting restaurant data");
    }
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Assuming 'restaurants' is an array of restaurant objects
  const shuffledRestaurants = shuffleArray(restaurants);

  return (
    <>
      <div className="res_title">Restaurants:</div>
      <div className="c_con">
        <div className="card_container">
          <Swiper
            spaceBetween={50}
            slidesPerView={4}
            onSlideChange={() => console.log("slide change")}
            breakpoints={{
              // when window width is >= 768px (tablet)
              1024: {
                slidesPerView: 6,
                spaceBetween: 270,
              },
              875: {
                slidesPerView: 6,
                spaceBetween: 220,
              },
              811: {
                slidesPerView: 4,
                spaceBetween: 190,
              },
              787: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 220,
              },
              773: {
                slidesPerView: 4,
                spaceBetween: 190,
              },

              747: {
                slidesPerView: 4,
                spaceBetween: 190,
              },
              // when window width is >= 576px (mobile)
              588: {
                slidesPerView: 3,
                spaceBetween: 110,
              },
              537: {
                slidesPerView: 3,
                spaceBetween: 170,
              },
              525: {
                slidesPerView: 3,
                spaceBetween: 190,
              },
              515: {
                slidesPerView: 3,
                spaceBetween: 220,
              },

              487: {
                slidesPerView: 2,
              },
              // when window width is >= 320px (small mobile)
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
            {/* {restaurants.map((restaurant, index) => (
              <SwiperSlide key={index} enableMouseEvents>
                <Link
                  to={`/dishes/${restaurant.id}`} // Pass restaurant ID as URL parameter
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Card className="card">
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={restaurant.imageUrl}
                        alt={restaurant.name}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h7"
                          component="div"
                          className="res_name"
                        >
                          {restaurant.name}
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="h7"
                          component="div"
                          className="res_rating"
                          // name="read-only"
                        >
                          <Star></Star>
                          {restaurant.rating}
                        </Typography>
                        <Typography
                          // variant="body2"
                          // color="text.secondary"
                          className="res_tags"
                        >
                          {restaurant.tags}.
                        </Typography>
                        <Typography
                          // variant="body2"
                          // color="text.secondary"
                          className="res_area"
                        >
                          {restaurant.area}.
                        </Typography>
                        <Typography
                          // variant="body2"
                          // color="text.secondary"
                          className="res_address"
                        >
                          {restaurant.city}.
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </SwiperSlide>
            ))} */}

            {shuffledRestaurants.map((restaurant, index) => (
              <SwiperSlide key={index} enableMouseEvents>
                <Link
                  to={`/dishes/${restaurant.id}`} // Pass restaurant ID as URL parameter
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Card className="card">
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={restaurant.imageUrl}
                        alt={restaurant.name}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h7"
                          component="div"
                          className="res_name"
                        >
                          {restaurant.name}
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="h7"
                          component="div"
                          className="res_rating"
                          // name="read-only"
                        >
                          <Star></Star>
                          {restaurant.rating}
                        </Typography>
                        <Typography
                          // variant="body2"
                          // color="text.secondary"
                          className="res_tags"
                        >
                          {restaurant.tags}.
                        </Typography>
                        <Typography
                          // variant="body2"
                          // color="text.secondary"
                          className="res_area"
                        >
                          {restaurant.area}.
                        </Typography>
                        <Typography
                          // variant="body2"
                          // color="text.secondary"
                          className="res_address"
                        >
                          {restaurant.city}.
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

export default Restaurants;
