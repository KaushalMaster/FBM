import React, { useState } from "react";
import Cart_card from "../Cart_card/Cart_card";
import "./Cart.css";
import Run_Cart from "../../Pages/Cart/Run_Cart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const Cart = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const sendTotalAmount = (totalAmount) => {
    setTotalAmount(totalAmount);
  };
  return (
    <div className="container" id="order__container">
      <div className="cart_title">My Orders</div>
      <div className="cart_items">
        <Cart_card getTotalAmount={sendTotalAmount} />
      </div>
      <div className="total_amt">
        <h3>Total Amount:</h3>
        <p>
          <CurrencyRupeeIcon className="currencyIcon" />
          {totalAmount}
        </p>
      </div>
      <button class="btn_checkout">Checkout</button>
    </div>
  );
};

export default Cart;
