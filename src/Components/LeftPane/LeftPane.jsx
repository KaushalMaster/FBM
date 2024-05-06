import React from "react";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 300;

const LeftPane = () => {
  // Map each navigation item with its respective icon
  const navigationItems = [
    { text: "Restaurants", icon: <RestaurantIcon /> },
    { text: "Dishes", icon: <RestaurantMenuIcon /> },
    { text: "User", icon: <PersonIcon /> },
    { text: "Orders", icon: <ShoppingCartIcon /> },
    { text: "Logout", icon: <LogoutIcon /> },
  ];

  return (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <div>
        {/* <Divid/er /> */}
        {/* Navigation items */}
        <Container
          sx={{
            mt: 12,
          }}
        >
          <List>
            {navigationItems.map(({ text, icon }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  {icon}
                  <ListItemText primary={text} sx={{ ml: 2 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Container>
      </div>
      {/* <Toolbar /> Spacer at the bottom */}
      <Container sx={{ backgroundColor: "black" }}>
        kdnflsdnlksdnflkn
      </Container>
    </Box>
  );
};

export default LeftPane;
