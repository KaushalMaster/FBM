import React, { useState } from "react";
import Cart_card from "../Cart_card/Cart_card";
import "./Cart.css";
import Run_Cart from "../../Pages/Cart/Run_Cart";

const Cart = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const sendTotalAmount = (totalAmount) => {
    setTotalAmount(totalAmount);
  };
  return (
    <div className="container" id="order__container">
      My Orders
      <div className="cart_items">
        <Cart_card getTotalAmount={sendTotalAmount} />
      </div>
      <div className="total_amt">
        <h3>Total Amount:</h3>
        <p>Rs.{totalAmount}</p>
      </div>
      <button class="btn_checkout">Checkout</button>
    </div>
  );
};

export default Cart;
