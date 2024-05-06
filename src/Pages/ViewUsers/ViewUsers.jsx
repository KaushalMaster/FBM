import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebase-config";
import DashboardLayout from "../../Components/dashboard";
import { Container } from "@mui/material";

const ViewUsers = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "User_logins"));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUserData(usersData);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  const columns = [
    // { field: "id", headerName: "ID", width: 250 },
    { field: "uid", headerName: "UID", width: 300 },
    { field: "displayName", headerName: "Display Name", width: 200 },
    { field: "lastSignInTime", headerName: "Last Sign In Time", width: 250 },
    {
      field: "photoURL",
      headerName: "Photo URL",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="profile"
          style={{ width: 50, height: 50, borderRadius: 50 }}
        />
      ),
    },
    { field: "provider", headerName: "Provider", width: 150 },
  ];

  return (
    <DashboardLayout>
      <Container style={{ height: 400, width: "100%", marginTop: 90 }}>
        <DataGrid
          rows={userData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Container>
    </DashboardLayout>
  );
};

export default ViewUsers;
