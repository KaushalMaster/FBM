import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Swal from "sweetalert2";
import { db, firestore, storage } from "../../Config/firebase-config";
import DashboardLayout from "../../Components/dashboard";
import {
  Grid,
  Box,
  Container,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Delete, Edit } from "@mui/icons-material";

const ViewDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const [newDish, setNewDish] = useState({
    dish_name: "",
    imageUrl: "",
    description: "",
    price: "",
    ratings: "",
    res_id: "",
    reviews: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [editDishId, setEditDishId] = useState("");

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const unsubscribe = onSnapshot(collection(db, "Dishes"), (snapshot) => {
          const fetchedDishes = [];
          snapshot.forEach((doc) => {
            fetchedDishes.push({ id: doc.id, ...doc.data() });
          });
          setDishes(fetchedDishes);
        });

        // Return an unsubscribe function to stop listening to changes when the component unmounts
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsSnapshot = await getDocs(
          collection(db, "Restaurants")
        );
        const fetchedRestaurants = [];
        restaurantsSnapshot.forEach((doc) => {
          fetchedRestaurants.push({ id: doc.id, ...doc.data() });
        });
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDish((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddDish = async () => {
    try {
      setLoading(true);
      const imageRef = ref(storage, "Dishes/" + newDish.image.name);
      const snapshot = await uploadBytesResumable(imageRef, newDish.image);
      const imgurl = await getDownloadURL(snapshot.ref);

      const dishData = {
        dish_name: newDish.dish_name,
        imageUrl: imgurl,
        description: newDish.description,
        price: newDish.price,
        ratings: newDish.ratings,
        res_id: newDish.res_id,
        reviews: newDish.reviews,
      };

      await addDoc(collection(db, "Dishes"), dishData);

      setLoading(false);

      setOpenAddModal(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Dish added successfully!",
      }).then(() => {
        setNewDish({
          dish_name: "",
          imageUrl: "",
          description: "",
          price: "",
          ratings: "",
          res_id: "",
          reviews: "",
          image: null,
        });
        setSelectedRestaurantId(""); // Resetting restaurant select field
      });
    } catch (error) {
      console.error("Error adding dish:", error);
      setLoading(false);
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await deleteDoc(doc(db, "Dishes", dishId));
      setDishes((prevDishes) =>
        prevDishes.filter((dish) => dish.id !== dishId)
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Dish deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  const handleRestaurantChange = (event) => {
    setSelectedRestaurantId(event.target.value);
    setNewDish((prevState) => ({
      ...prevState,
      res_id: event.target.value,
    }));
  };

  const handleOpenEditModal = (dishId) => {
    const dishToEdit = dishes.find((dish) => dish.id === dishId);
    setNewDish(dishToEdit);
    setEditDishId(dishId);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setNewDish({
      dish_name: "",
      imageUrl: "",
      price: "",
      ratings: "",
      res_id: "",
      reviews: "",
      image: null,
    });
    setEditDishId("");
  };

  const handleEditDish = async () => {
    try {
      setLoading(true);
      const imageRef = ref(storage, "Dishes/" + newDish.image.name);
      const snapshot = await uploadBytesResumable(imageRef, newDish.image);
      const imgurl = await getDownloadURL(snapshot.ref);

      const updatedDishData = {
        dish_name: newDish.dish_name,
        imageUrl: imgurl,
        description: newDish.description,
        price: newDish.price,
        ratings: newDish.ratings,
        res_id: newDish.res_id,
        reviews: newDish.reviews,
      };

      await updateDoc(doc(db, "Dishes", editDishId), updatedDishData);

      setLoading(false);

      setOpenEditModal(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Dish updated successfully!",
      }).then(() => {
        setNewDish({
          dish_name: "",
          imageUrl: "",
          description: "",
          price: "",
          ratings: "",
          res_id: "",
          reviews: "",
          image: null,
        });
      });
    } catch (error) {
      console.error("Error updating dish:", error);
      setLoading(false);
    }
  };

  // Function to filter dishes based on search query
  const filteredDishes = dishes.filter((dish) =>
    dish.dish_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      renderCell: (params) => (
        <div>
          <Button
            startIcon={<Edit />}
            onClick={() => handleOpenEditModal(params.row.id)}
          ></Button>
          <Button
            startIcon={<Delete />}
            onClick={() => handleDeleteDish(params.row.id)}
          ></Button>
        </div>
      ),
    },

    { field: "id", headerName: "ID", width: 230 },
    { field: "dish_name", headerName: "Name", width: 250 },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 140,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.dish_name}
          style={{ width: 100 }}
        />
      ),
    },
    { field: "description", headerName: "Description", width: 200 },
    { field: "price", headerName: "Price", width: 60 },
    { field: "ratings", headerName: "Ratings", width: 60 },
    { field: "res_id", headerName: "Restaurant ID", width: 200 },
    { field: "reviews", headerName: "Reviews", width: 100 },
  ];

  return (
    <DashboardLayout>
      <Container style={{ height: 400, width: "100%" }}>
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            onClick={handleOpenAddModal}
            style={{ marginBottom: "20px" }}
          >
            Add Dish
          </Button>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "20px", marginLeft: "20px" }}
          />
        </Box>
        {/* <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataGrid rows={dishes} columns={columns} pageSize={5} />
          </Grid>
        </Grid> */}
        <div style={{ height: 400, width: "100%" }}>
          {/* display the dishes data grid until search query is empty else display the filteredDishes */}
          {!searchQuery ? (
            <DataGrid
              rows={dishes}
              columns={columns}
              pageSize={5}
              disableRowSelectionOnClick
            />
          ) : (
            <DataGrid
              rows={filteredDishes}
              columns={columns}
              pageSize={5}
              disableRowSelectionOnClick
            />
          )}
          {/* <DataGrid
            rows={dishes}
            columns={columns}
            pageSize={5}
            disableRowSelectionOnClick
          /> */}
        </div>
      </Container>
      {/* Add a Dish Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Add a new Dish</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            name="dish_name"
            value={newDish.dish_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            variant="outlined"
            name="description"
            value={newDish.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            variant="outlined"
            name="price"
            value={newDish.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ratings"
            variant="outlined"
            name="ratings"
            value={newDish.ratings}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Restaurant</InputLabel>
            <Select
              value={selectedRestaurantId}
              onChange={handleRestaurantChange}
            >
              {restaurants.map((restaurant) => (
                <MenuItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Restaurant ID"
            variant="outlined"
            name="res_id"
            value={selectedRestaurantId}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reviews"
            variant="outlined"
            name="reviews"
            value={newDish.reviews}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewDish((prevState) => ({
                ...prevState,
                image: e.target.files[0],
              }))
            }
            style={{ marginTop: "16px" }}
          />
          {loading && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleAddDish}
            style={{ marginTop: "20px" }}
            disabled={loading}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Edit Dish Dialog */}
      {/* Edit Dish Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Dish</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            name="dish_name"
            value={newDish.dish_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            variant="outlined"
            name="description"
            value={newDish.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            variant="outlined"
            name="price"
            value={newDish.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ratings"
            variant="outlined"
            name="ratings"
            value={newDish.ratings}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Restaurant</InputLabel>
            <Select
              value={selectedRestaurantId}
              onChange={handleRestaurantChange}
            >
              {restaurants.map((restaurant) => (
                <MenuItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Restaurant ID"
            variant="outlined"
            name="res_id"
            value={selectedRestaurantId}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reviews"
            variant="outlined"
            name="reviews"
            value={newDish.reviews}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewDish((prevState) => ({
                ...prevState,
                image: e.target.files[0],
              }))
            }
            style={{ marginTop: "16px" }}
          />
          {loading && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleEditDish}
            style={{ marginTop: "20px" }}
            disabled={loading}
          >
            Update
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseEditModal}
            style={{ marginTop: "20px" }}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ViewDishes;
