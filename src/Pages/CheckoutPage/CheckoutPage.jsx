import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./CheckoutPage.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CheckoutPage = () => {
  return (
    <>
      <Navbar />

      <div className="secure__checkout">
        <h2>Secure </h2>
        <span>Checkout</span>
      </div>

      <div className="main__container">
        <div className="container_one">
          <div className="address_container">
            <div className="address_header">
              <div className="address__icon">
                <LocationOnIcon className="icon"></LocationOnIcon>
                <h2>Address</h2>
              </div>

              <button>Choose Another Address</button>
            </div>
            <div className="address_details">
              <h3>Kaushal Soni</h3>
              <p className="address">
                104, Deepsarita Appartment N/R LG Corner Maninagar Ahmedabad-08
              </p>

              <p>India-380008</p>
              <p>Phone: 1928374650</p>
              <div className="edit__address">
                <button>
                  <EditIcon></EditIcon>Edit address
                </button>
              </div>
            </div>
          </div>
          <div className="cart">
            <div className="cart__header">
              <h2>Your</h2> <span>Cart</span>{" "}
              <span className="cart__total">(3 Items)</span>
            </div>

            <div className="cart__items">
              <div className="item__img">
                <img src="/assets/food_item.png" alt="" />
              </div>
              <div className="items__details">
                <h3>Alio-olio Pasta</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Necessitatibus perspiciatis perferendis, corporis sequi ipsam
                  ipsa facere natus ipsum totam quo delectus, eius explicabo
                </p>
                <div className="item__info">
                  <p className="item__price">$20</p>
                  <p className="item__quantity">Quantity: </p>
                  <button>+</button>
                  <span>1</span>
                  <button className="btn__minus">-</button>
                  <p className="item__review">⭐4.5</p>
                </div>
              </div>
              <DeleteIcon className="del__icon"></DeleteIcon>
            </div>
            <br></br>

            <div className="cart__items">
              <div className="item__img">
                <img src="/assets/food_item.png" alt="" />
              </div>
              <div className="items__details">
                <h3>Alio-olio Pasta</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Necessitatibus perspiciatis perferendis, corporis sequi ipsam
                  ipsa facere natus ipsum totam quo delectus, eius explicabo
                </p>
                <div className="item__info">
                  <p className="item__price">$20</p>
                  <p className="item__quantity">Quantity: </p>
                  <button>+</button>
                  <span>1</span>
                  <button className="btn__minus">-</button>
                  <p className="item__review">⭐4.5</p>
                </div>
              </div>
              <DeleteIcon className="del__icon"></DeleteIcon>
            </div>

            <div className="cart__items">
              <div className="item__img">
                <img src="/assets/food_item.png" alt="" />
              </div>
              <div className="items__details">
                <h3>Alio-olio Pasta</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Necessitatibus perspiciatis perferendis, corporis sequi ipsam
                  ipsa facere natus ipsum totam quo delectus, eius explicabo
                </p>
                <div className="item__info">
                  <p className="item__price">$20</p>
                  <p className="item__quantity">Quantity: </p>
                  <button>+</button>
                  <span>1</span>
                  <button className="btn__minus">-</button>
                  <p className="item__review">⭐4.5</p>
                </div>
              </div>
              <DeleteIcon className="del__icon"></DeleteIcon>
            </div>
          </div>
        </div>
        <div className="container_two">
          <div className="payment">
            <h2>Order Summary</h2>
            <div className="payment__description">
              <div className="payment_bag_total">
                <p className="order_summary_name">Bag Total</p>
                <p className="order_summary_price">RS. 230</p>
              </div>
              <div className="payment_bag_discount">
                <p className="order_summary_name">Bag Discount</p>
                <p className="order_summary_price">RS. 230</p>
              </div>
              <div className="payment_delivery">
                <p className="order_summary_name">Delivery Charges</p>
                <p className="order_summary_price">RS. 230</p>
              </div>
              <div className="payment_total">
                <p className="order_summary_name_total">Order Total</p>
                <p className="order_summary_price_total">RS. 230</p>
              </div>
              <div className="line">
                __________________________________________________________
              </div>
            </div>
            <div className="payment_details">
              <button className="btn__payNow">
                Pay <span className="amt__toPay">Rs.680</span>{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
