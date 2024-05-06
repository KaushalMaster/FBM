// import SvgColor from 'src/components/svg-color';

import { Edit } from "@mui/icons-material";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Person2Icon from "@mui/icons-material/Person2";

// // ----------------------------------------------------------------------

// const icon = (name) => (
//   <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
// );

const navConfig = [
  // {
  //   title: "dashboard",
  //   path: "/admin/dashboard/restaurants/data",
  //   icon: <Edit />,
  // },
  {
    title: "Restaurants",
    path: "/admin/dashboard/restaurants/data",
    icon: <RestaurantIcon />,
  },
  {
    title: "Dishes",
    path: "/admin/dashboard/dishes/data",
    icon: <DinnerDiningIcon />,
  },
  {
    title: "Users",
    path: "/admin/dashboard/users/data/",
    icon: <Person2Icon />,
  },
  // {
  //   title: "login",
  //   path: "/login",
  //   icon: icon("ic_lock"),
  // },
  // {
  //   title: "Not found",
  //   path: "/404",
  //   icon: icon("ic_disabled"),
  // },
];

export default navConfig;
