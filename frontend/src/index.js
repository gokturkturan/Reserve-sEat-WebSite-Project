import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import RestaurantDetails from "./pages/RestaurantDetails";
import UserRoute from "./components/UserRoute";
import RestaurantRoute from "./components/RestaurantRoute";
import Branches from "./pages/restaurantPages/Branches";
import EditBranch from "./pages/restaurantPages/EditBranch";
import SelectReservationDetails from "./pages/SelectReservationDetails";
import Reservations from "./pages/restaurantPages/Reservations";
import RestaurantProfile from "./pages/restaurantPages/RestaurantProfile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<Home />}></Route>
      <Route path="/search/:keyword" element={<Home />}></Route>
      <Route path="/page/:pageNumber" element={<Home />}></Route>
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<Home />}
      ></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/restaurant/:id" element={<RestaurantDetails />}></Route>

      {/* User Routes */}
      <Route path="" element={<UserRoute />}>
        <Route path="/profile" element={<Profile />}></Route>
        <Route
          path="/selectReservationDetails/:id"
          element={<SelectReservationDetails />}
        ></Route>
      </Route>

      <Route path="" element={<RestaurantRoute />}>
        <Route
          path="/restaurantProfile"
          element={<RestaurantProfile />}
        ></Route>
        <Route path="/restaurant/branches" element={<Branches />}></Route>
        <Route
          path="/restaurant/editBranch/:id"
          element={<EditBranch />}
        ></Route>
        <Route
          path="/restaurant/reservations"
          element={<Reservations />}
        ></Route>
        <Route
          path="/restaurant/reservations/page/:pageNumber"
          element={<Reservations />}
        ></Route>
        <Route
          path="/restaurant/reservations/branch/:keyword"
          element={<Reservations />}
        ></Route>
        <Route
          path="/restaurant/reservations/date/:date"
          element={<Reservations />}
        ></Route>
        <Route
          path="/restaurant/reservations/branch/:keyword/page/:pageNumber"
          element={<Reservations />}
        ></Route>
        <Route
          path="/restaurant/reservations/date/:date/page/:pageNumber"
          element={<Reservations />}
        ></Route>
        <Route
          path="/restaurant/reservations/branch/:keyword/date/:date"
          element={<Reservations />}
        ></Route>
        <Route
          path="/restaurant/reservations/branch/:keyword/date/:date/page/:pageNumber"
          element={<Reservations />}
        ></Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
