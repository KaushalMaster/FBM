import React, { useState, useEffect } from "react";
import "./Navbar.css";
import {
  Avatar,
  Dialog,
  Card,
  CardMedia,
  CardContent,
  Typography,
  List,
  CardActionArea,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  DialogContent,
} from "@mui/material";
import { auth, db, firestore } from "../../Config/firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Swal from "sweetalert2";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  documentId,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { SwiperSlide, Swiper } from "swiper/react";
import Cart from "../Cart/Cart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        Swal.fire({
          title: "Login Successful!",
          text: "Do you want to continue",
          icon: "success",
          confirmButtonText: "yes",
        });
        saveUserDataToFirebase(result.user);
        setDrawerOpen(false);
      })
      .catch((error) => {
        console.log("Error: ", error.message);
      });
  };

  const toggleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setAnchorEl(null);
  };

  const showLogoutModal = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  const saveUserDataToFirebase = (user) => {
    const userRef = addDoc(collection(firestore, "User_logins"), {
      uid: user?.uid,
      displayName: user.displayName,
      email: user.email,
      lastSignInTime: new Date(user.metadata.lastSignInTime)?.toISOString(),
      photoURL: user.photoURL,
      provider: "Google",
    });
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log("Error: ", error.message);
      });
  };

  const toggleCartPopup = () => {
    setCartOpen(!cartOpen);
  };

  const handleSearchIconClick = () => {
    setIsSearchBarOpen(true); // Open the search bar when the search icon is clicked
  };

  const handleSearchClose = () => {
    setIsSearchBarOpen(false); // Close the search bar
  };

  const handleSearch = async () => {
    if (searchQuery.length > 0) {
      const querySnapshot = await getDocs(collection(db, "Dishes"));
      const fetchedDishes = [];
      querySnapshot.forEach((doc) => {
        fetchedDishes.push({ id: doc.id, ...doc.data() });
      });

      const restaurantIds = fetchedDishes
        .filter((dish) => dish.dish_name.includes(searchQuery))
        .map((dish) => dish.res_id);

      const restaurantRef = collection(db, "Restaurants");
      const restaurantQuery = query(
        restaurantRef,
        where(documentId(), "in", restaurantIds)
      );
      const restaurantsData = await getDocs(restaurantQuery);

      let foundRestaurants = [];
      restaurantsData.forEach((doc) => {
        foundRestaurants.push({ id: doc.id, ...doc.data() });
      });

      setFilteredRestaurants(foundRestaurants);
      setShowResults(true);
      setModalOpen(true);
      setIsSearchBarOpen(false); // Close the search bar after searching
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowResults(false);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  return (
    <div className="b">
      <div className="main_container">
        <div className="logo">
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="Logo"
              width={200}
              className="logo_img"
            />
          </Link>
        </div>

        <div className="profile">
          <div className="searchIconContainer">
            <IconButton onClick={handleSearchIconClick}>
              <SearchIcon />
            </IconButton>
          </div>
          <Avatar
            src={user ? user.photoURL : "/assets/ProfileAvtar.png"}
            alt="profilePic"
            onClick={isLoggedIn ? toggleProfileMenu : handleLoginWithGoogle}
          />
          {isLoggedIn && (
            <span>
              {/* <Typography variant="body1">{user.displayName}</Typography> */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeProfileMenu}
              >
                <MenuItem>
                  <Typography variant="inherit">
                    Hello, {user.displayName}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={toggleCartPopup}>
                  <ShoppingCartIcon fontSize="small" />
                  <Typography variant="inherit">Order Cart</Typography>
                </MenuItem>
                <MenuItem onClick={showLogoutModal}>
                  <ExitToAppIcon fontSize="small" />
                  <Typography variant="inherit">Logout</Typography>
                </MenuItem>
              </Menu>
            </span>
          )}
        </div>

        {/* Search dialog */}
        <Dialog
          open={isSearchBarOpen}
          onClose={handleSearchClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <TextField
              placeholder="Search by Dish Name"
              variant="outlined"
              size="small"
              fullWidth // Make the search bar width full
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={modalOpen} onClose={handleCloseModal}>
          {showResults && (
            <div className="filtered_Restaurants">
              <h2>Recommended Restaurants</h2>
              <Swiper
                direction="horizontal"
                spaceBetween={2}
                slidesPerView={2}
                onSlideChange={() => console.log("slide change")}
              >
                <List>
                  {filteredRestaurants.map((restaurant, index) => (
                    <SwiperSlide key={index} enableMouseEvents>
                      <Link
                        to={`/dishes/${restaurant.id}`}
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
                              >
                                {restaurant.name}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Link>
                    </SwiperSlide>
                  ))}
                </List>
              </Swiper>
            </div>
          )}
        </Dialog>
        <Dialog
          open={cartOpen}
          onClose={handleCartClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "@media (max-width: 600px)": {
              width: "90%",
              margin: "auto",
            },
            "@media (min-width: 601px)": {
              width: "60%",
              margin: "auto",
            },
          }}
        >
          <Cart onClose={handleCartClose} />
        </Dialog>
      </div>
    </div>
  );
};

export default Navbar;
