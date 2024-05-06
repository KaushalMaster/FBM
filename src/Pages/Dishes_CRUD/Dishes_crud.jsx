import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { db, storage } from "../../Config/firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

const schema = yup.object().shape({
  dish_name: yup.string().required("Dish name is required"),
  description: yup.string().required("Description is required"),
  price: yup.string().required("Price is required"),
  ratings: yup.string().required("Ratings is required"),
  // res_id: yup.string(),
  reviews: yup.string().required("Reviews is required"),
});

const Dishes_crud = () => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  console.log(id);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  // const [imageUrl, setImageUrl] = useState("");

  const uploadDishImage = async (file) => {
    // Upload the image to Firebase Storage
    const storageRef = ref(storage, "Dishes/" + file.name);

    const uploadTask = await uploadBytesResumable(storageRef, file);
    const url = await getDownloadURL(uploadTask.task.snapshot.ref);
    // Use the image URL to store in Firestore
    return url;
    console.log(url);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const url = await uploadDishImage(fileInputRef.current.files[0]);
    try {
      await addDoc(collection(db, "Dishes"), {
        imageUrl: url,
        dish_name: data.dish_name,
        description: data.description,
        price: data.price,
        ratings: data.ratings,
        res_id: id,
        reviews: data.reviews,
      });
      // alert("Dish added successfully");
      Swal.fire({ title: "Dish added successfully", icon: "success" });
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Error adding dish: ", error);
      // alert("Error adding dish");
      Swal.error({ title: "Error adding dish", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Dish</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* dish image */}
        <div>
          <label>Image:</label>
          <input type="file" {...register("image")} ref={fileInputRef} />
          {errors.image && (
            <p style={{ color: "red" }}>{errors.image.message}</p>
          )}
        </div>
        <div>
          <label>Dish Name:</label>
          <input type="text" {...register("dish_name")} />
          {errors.dish_name && (
            <p style={{ color: "red" }}>{errors.dish_name.message}</p>
          )}
        </div>
        <div>
          <label>Description</label>
          <input type="text" {...register("description")} />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description.message}</p>
          )}
        </div>
        <div>
          <label>Price:</label>
          <input type="text" {...register("price")} />
          {errors.price && (
            <p style={{ color: "red" }}>{errors.price.message}</p>
          )}
        </div>
        <div>
          <label>Ratings:</label>
          <input type="text" {...register("ratings")} />
          {errors.ratings && (
            <p style={{ color: "red" }}>{errors.ratings.message}</p>
          )}
        </div>
        {/* <div>
          <label hidden>Restaurant ID:</label>
          <input type="text" {...register("res_id")} hidden />
          {errors.res_id && (
            <p style={{ color: "red" }}>{errors.res_id.message}</p>
          )}
        </div> */}
        <div>
          <label>Reviews:</label>
          <input type="text" {...register("reviews")} />
          {errors.reviews && (
            <p style={{ color: "red" }}>{errors.reviews.message}</p>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Dishes_crud;
