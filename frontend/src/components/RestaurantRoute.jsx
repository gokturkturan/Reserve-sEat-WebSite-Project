import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RestaurantRoute = () => {
  const { userInfo } = useSelector((state) => state.user);
  return userInfo && userInfo.type === "restaurant" ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace />
  );
};

export default RestaurantRoute;
