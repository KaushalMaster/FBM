import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import { Paper } from "@mui/material";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Config/firebase-config";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const CartCard = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    console.log("effext");
    fetchCartDetails();
  }, [currentUser]);

  const fetchCartDetails = () => {
    const q = query(
      collection(db, "User_cart"),
      where("userId", "==", currentUser)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usercartdata = [];
      querySnapshot.forEach((doc) => {
        usercartdata.push({ id: doc.id, ...doc.data() });
      });
      setCartItems(usercartdata);
      // Calculate total amount
      calculateTotalAmount(usercartdata);
    });

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(doc(db, "User_cart", itemId));
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      fetchCartDetails();
      sendTotalAmount();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleQuantityUpdate = async (itemId, newQuantity) => {
    try {
      const itemRef = doc(db, "User_cart", itemId);
      await updateDoc(itemRef, {
        quantity: newQuantity,
      });
      fetchCartDetails();
      sendTotalAmount();
    } catch (error) {
      console.error("Error updating quantity: ", error);
    }
  };

  const calculateTotalAmount = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
  };

  const sendTotalAmount = () => {
    props.getTotalAmount(totalAmount);
  };

  return (
    <div>
      {cartItems.map((item) => (
        <Card
          key={item.id}
          sx={{
            maxWidth: 345,
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
            position: "relative",
          }}
        >
          <CardMedia
            sx={{ height: 140, width: 140 }}
            image={item.imageUrl}
            title="product"
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginLeft: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    textAlign: "start",
                  }}
                >
                  {item.dish_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price:{" "}
                  <span style={{ color: "lightgray" }}>
                    <CurrencyRupeeIcon className="currencyIcon" />
                    {`${item.price}`}
                  </span>
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                }}
              >
                <button
                  style={{
                    marginRight: "5px",
                    padding: "5px",
                    backgroundColor: "#f0f0f0",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleQuantityUpdate(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
                <p style={{ margin: "0 10px" }}>{item.quantity}</p>
                <button
                  style={{
                    marginLeft: "5px",
                    padding: "5px",
                    backgroundColor: "#f0f0f0",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (item.quantity > 1) {
                      handleQuantityUpdate(item.id, item.quantity - 1);
                    } else {
                      handleDelete(item.id);
                    }
                  }}
                >
                  -
                </button>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                gap: "60px",
                right: "-10px",
              }}
            >
              <IconButton
                sx={{
                  padding: 0,
                  alignSelf: "flex-end",
                }}
                onClick={() => handleDelete(item.id)}
              >
                <Close
                  sx={{
                    color: "red",
                  }}
                />
              </IconButton>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ alignSelf: "right" }}
              >
                {/* Calculate and display the total price */}
                <CurrencyRupeeIcon className="currencyIcon" />

                {`RS.${item.price * item.quantity}`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
      {/* Display total amount */}
      <Typography variant="h6" align="right" gutterBottom>
        {/* Total: ${totalAmount} */}
        {sendTotalAmount()}
      </Typography>
    </div>
  );
};

export default CartCard;
