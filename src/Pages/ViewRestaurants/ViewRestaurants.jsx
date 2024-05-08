import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db, storage } from "../../Config/firebase-config";
import Swal from "sweetalert2";
import DashboardLayout from "../../Components/dashboard";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ViewRestaurants = () => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddDishModal, setOpenAddDishModal] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    city: "",
    area: "",
    phone: "",
    rating: "",
    res_timming_mon_to_fri: "",
    res_timming_sat_and_sun: "",
    tags: "",
    image: null,
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Restaurants"));
        const fetchedRestaurants = [];
        querySnapshot.forEach((doc) => {
          fetchedRestaurants.push({ id: doc.id, ...doc.data() });
        });
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleOpenUpdateModal = (restaurant) => {
    setUpdatedData(restaurant);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewRestaurantChange = (event) => {
    if (event.target.name === "image") {
      setNewRestaurant((prevState) => ({
        ...prevState,
        image: event.target.files[0],
      }));
    } else {
      const { name, value } = event.target;
      setNewRestaurant((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddRestaurant = async () => {
    try {
      setLoading(true);
      const imageRef = ref(storage, "Restaurant/" + newRestaurant.image.name);
      const snapshot = await uploadBytesResumable(
        imageRef,
        newRestaurant.image
      );
      const imgUrl = await getDownloadURL(snapshot.ref);

      const { image, ...restData } = newRestaurant;
      await addDoc(collection(db, "Restaurants"), {
        ...restData,
        imageUrl: imgUrl,
      });

      setRestaurants([
        ...restaurants,
        { id: snapshot.ref.name, ...restData, imageUrl: imgUrl },
      ]);

      // Reset the state of newRestaurant to its initial empty values
      setNewRestaurant({
        name: "",
        city: "",
        area: "",
        phone: "",
        rating: "",
        res_timming_mon_to_fri: "",
        res_timming_sat_and_sun: "",
        tags: "",
        image: null,
        imageUrl: "",
      });

      setLoading(false);
      handleCloseAddModal();
      Swal.fire("Added!", "Restaurant has been added successfully.", "success");
    } catch (error) {
      console.error("Error adding restaurant:", error);
      Swal.fire("Error!", "Failed to add restaurant.", "error");
      setLoading(false);
    }
  };

  const handleDelete = async (restaurantId) => {
    try {
      await deleteDoc(doc(db, "Restaurants", restaurantId));
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId)
      );
      Swal.fire("Deleted!", "Restaurant has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      Swal.fire("Error!", "Failed to delete restaurant.", "error");
    }
  };

  const updateRestaurant = async () => {
    try {
      setLoading(true);
      const { image, ...restData } = updatedData;
      if (image) {
        const imageRef = ref(storage, "Restaurant/" + image.name);
        const snapshot = await uploadBytesResumable(imageRef, image);
        const imgUrl = await getDownloadURL(snapshot.ref);
        await updateDoc(doc(db, "Restaurants", updatedData.id), {
          ...restData,
          imageUrl: imgUrl,
        });
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.id === updatedData.id
              ? { ...restData, imageUrl: imgUrl }
              : restaurant
          )
        );
      } else {
        await updateDoc(doc(db, "Restaurants", updatedData.id), restData);
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.id === updatedData.id ? restData : restaurant
          )
        );
      }
      setLoading(false);
      handleCloseUpdateModal();
      Swal.fire(
        "Updated!",
        "Restaurant has been updated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Error updating restaurant:", error);
      Swal.fire("Error!", "Failed to update restaurant.", "error");
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (filter === "") {
      return (
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return (
        restaurant.rating === filter &&
        (restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  });

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleOpenUpdateModal(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
    { field: "id", headerName: "Id", width: 100 },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Restaurant"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 200 },
    { field: "city", headerName: "City", width: 250 },
    { field: "area", headerName: "Area", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "rating", headerName: "Rating", width: 120 },
    { field: "tags", headerName: "Tags", width: 120 },
    { field: "res_timming_mon_to_fri", headerName: "Mon to Fri", width: 200 },
    {
      field: "res_timming_sat_and_sun",
      headerName: "Sat and Sun",
      width: 200,
    },
  ];

  return (
    <DashboardLayout>
      <Container>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 15, mb: 5 }}
          onClick={handleOpenAddModal}
        >
          Add Restaurant
        </Button>
        <div style={{ marginBottom: "16px" }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginLeft: "16px" }}
          >
            <MenuItem value="">All Ratings</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
          </Select>
        </div>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredRestaurants}
            columns={columns}
            pageSize={5}
            checkboxSelection
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </div>

        <Dialog open={openUpdateModal} onClose={handleCloseUpdateModal}>
          <DialogTitle>Update Restaurant</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={updatedData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={updatedData.address}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              value={updatedData.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Rating"
              name="rating"
              value={updatedData.rating}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mon to Fri Timming"
              name="res_timming_mon_to_fri"
              value={updatedData.res_timming_mon_to_fri}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Sat and Sun Timming"
              name="res_timming_sat_and_sun"
              value={updatedData.res_timming_sat_and_sun}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setUpdatedData((prevState) => ({
                  ...prevState,
                  image: e.target.files[0],
                }))
              }
              style={{ marginTop: "16px" }}
            />
            {loading && <CircularProgress />}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateModal} color="primary">
              Cancel
            </Button>
            <Button onClick={updateRestaurant} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAddModal} onClose={handleCloseAddModal}>
          <DialogTitle>Add Restaurant</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={newRestaurant.name}
              onChange={handleNewRestaurantChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={newRestaurant.city}
              onChange={handleNewRestaurantChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Area"
              name="area"
              value={newRestaurant.area}
              onChange={handleNewRestaurantChange}
              fullWidth
            ></TextField>
            <TextField
              label="Phone"
              name="phone"
              value={newRestaurant.phone}
              onChange={handleNewRestaurantChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Rating"
              name="rating"
              value={newRestaurant.rating}
              onChange={handleNewRestaurantChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mon to Fri Timming"
              name="res_timming_mon_to_fri"
              value={newRestaurant.res_timming_mon_to_fri}
              onChange={handleNewRestaurantChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Sat and Sun Timming"
              name="res_timming_sat_and_sun"
              value={newRestaurant.res_timming_sat_and_sun}
              onChange={handleNewRestaurantChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tags"
              name="tags"
              value={newRestaurant.tags}
              onChange={handleNewRestaurantChange}
              fullWidth
              margin="normal"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewRestaurant((prevState) => ({
                  ...prevState,
                  image: e.target.files[0],
                }))
              }
              style={{ marginTop: "16px" }}
            />
            {loading && <CircularProgress />}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddRestaurant} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {loading && (
          <Dialog open={loading}>
            <DialogContent>
              <CircularProgress />
            </DialogContent>
          </Dialog>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default ViewRestaurants;
