import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { db, storage } from "../../Config/firebase-config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  image: yup.string().required("Image is required"),
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  rating: yup.string().required("Rating is required"),
  reviews: yup.string().required("Reviews is required"),
  address: yup.string().required("Address is required"),
  res_timming_mon_to_fri: yup.string().required("Timing is required"),
  res_timming_sat_and_sun: yup.string().required("Timing is required"),
});

const AddRestaurant = () => {
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

  useEffect(() => {
    console.log("restaurant");
    getRestaurantData();
  }, []);

  const uploadFile = async (file) => {
    console.log(file);
    const storageRef = ref(storage, "Restaurant/" + file.name);

    const uploadTask = await uploadBytesResumable(storageRef, file);
    const url = await getDownloadURL(uploadTask.task.snapshot.ref);
    return url;
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
  };

  const [restaurants, setRestaurants] = useState([]);

  const onSubmit = async (data) => {
    try {
      const url = await uploadFile(fileInputRef.current.files[0]);
      const restaurantData = { ...data, imgUrl: url };
      reset();
      await addDoc(collection(db, "Restaurants"), restaurantData);
      getRestaurantData();
      console.log("Restaurant Added Successfully");
    } catch (error) {
      console.error("Error adding restaurant: ", error);
      alert("Error adding restaurant");
    }
  };

  const getRestaurantData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Restaurants"));
      const fetchedRestaurants = [];
      querySnapshot.forEach((doc) => {
        fetchedRestaurants.push({ id: doc.id, ...doc.data() });
      });
      setRestaurants(fetchedRestaurants);
    } catch (error) {
      console.error("Error getting restaurant data: ", error);
      alert("Error getting restaurant data");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/* upload restaurant image */}
          <label>Upload Restaurant Image:</label>
          <input type="file" ref={fileInputRef} />
          {errors.image && (
            <p style={{ color: "red" }}>{errors.image.message}</p>
          )}
        </div>
        <div>
          <label>Name:</label>
          <input type="text" {...register("name")} />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" {...register("phone")} />
          {errors.phone && (
            <p style={{ color: "red" }}>{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label>Rating:</label>
          <input type="text" {...register("rating")} />
          {errors.rating && (
            <p style={{ color: "red" }}>{errors.rating.message}</p>
          )}
        </div>
        <div>
          <label>Reviews:</label>
          <input type="text" {...register("reviews")} />
          {errors.reviews && (
            <p style={{ color: "red" }}>{errors.reviews.message}</p>
          )}
        </div>
        <div>
          <label>Address:</label>
          <input type="text" {...register("address")} />
          {errors.address && (
            <p style={{ color: "red" }}>{errors.address.message}</p>
          )}
        </div>
        <div>
          <label>Monday to Friday Timing:</label>
          <input type="text" {...register("res_timming_mon_to_fri")} />
          {errors.res_timming_mon_to_fri && (
            <p style={{ color: "red" }}>
              {errors.res_timming_mon_to_fri.message}
            </p>
          )}
        </div>
        <div>
          <label>Saturday and Sunday Timing:</label>
          <input type="text" {...register("res_timming_sat_and_sun")} />
          {errors.res_timming_sat_and_sun && (
            <p style={{ color: "red" }}>
              {errors.res_timming_sat_and_sun.message}
            </p>
          )}
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AddRestaurant;
