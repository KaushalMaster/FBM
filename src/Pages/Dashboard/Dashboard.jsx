import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { db, storage } from "../../Config/firebase-config";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Navbar from "../../Components/Navbar/Navbar";
import AddRestaurant from "../../Components/AddRestaurant/AddRestaurant";
import LeftPane from "../../Components/LeftPane/LeftPane";
import ViewRestaurants from "../ViewRestaurants/ViewRestaurants";
import "./Dashboard.css";
import { Box } from "@mui/material";
import ViewDishes from "../ViewDishes/ViewDishes";
import DashboardLayout from "../../Components/dashboard/";

const schema = yup.object().shape({
  address: yup.string().required(),
  name: yup.string().required(),
  phone: yup.string().required(),
  rating: yup.string().required(),
  reviews: yup.string().required(),
  res_timming_mon_to_fri: yup.string().required(),
  res_timming_sat_and_sun: yup.string().required(),
});

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const openUpdateModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const closeUpdateModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
  };

  // const onUpdate = async (data) => {
  //   if (data) {
  //     try {
  //       const restaurantRef = doc(db, "Restaurants", selectedRestaurant.id);
  //       await updateDoc(restaurantRef, data);
  //       alert("Restaurant updated successfully");
  //       closeUpdateModal();
  //       getRestaurantData();
  //     } catch (error) {
  //       console.error("Error updating restaurant: ", error);
  //       alert("Error updating restaurant");
  //     }
  //   } else {
  //     alert("Error updating restaurant");
  //   }
  // };

  const handleAddDish = (res_id) => {
    navigate(`/dish_crud/${res_id}`);
  };
  return (
    // {/* <Navbar /> */}
    <DashboardLayout>
      <div className="header__title">Welcome,</div>
    </DashboardLayout>

    // <Box sx={{ gap: 1, display: "flex", flexDirection: "row" }}>
    //   {/* <LeftPane /> */}
    //   <ViewRestaurants />
    //   {/* <ViewDishes /> */}
    // </Box>
  );
};

export default Dashboard;
