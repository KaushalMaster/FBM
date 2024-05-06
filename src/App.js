import { Router } from "@mui/icons-material";
import "./App.css";
import FoodDetails from "./Pages/FoodDetails/FoodDetails";
import Homepage from "./Pages/HomePage/Homepage";
import CheckoutPage from "./Pages/CheckoutPage/CheckoutPage";
import Dishes from "./Pages/Dishes/Dishes";
import Run_Cart from "./Pages/Cart/Run_Cart";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { useEffect, useState } from "react";
import { auth } from "./Config/firebase-config";
import { AuthContext, AuthProvider } from "./AuthContext/AuthContext";
import Dishes_crud from "./Pages/Dishes_CRUD/Dishes_crud";
import ViewRestaurants from "./Pages/ViewRestaurants/ViewRestaurants";
import ViewDishes from "./Pages/ViewDishes/ViewDishes";
import ViewUsers from "./Pages/ViewUsers/ViewUsers";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/Dish/Dish_Details/:id" element={<FoodDetails />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin/dashboard" element={<ViewRestaurants />} />
            <Route path="/dishes/:restaurantId" element={<Dishes />} />
            <Route path="/dish_crud/:id" element={<Dishes_crud />} />
            <Route path="/dish:id" element={<FoodDetails />} />
            <Route path="/cart" element={<Run_Cart />} />
            <Route
              path="/admin/dashboard/restaurants/data"
              element={<ViewRestaurants />}
            />
            <Route
              path="/admin/dashboard/dishes/data"
              element={<ViewDishes />}
            />
            <Route
              path="/admin/dashboard/users/data/"
              element={<ViewUsers />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
