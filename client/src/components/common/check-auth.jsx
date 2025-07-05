import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  // If authentication is still being checked, render nothing (or a loading indicator)

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/listing" />;
      }
    }
  }

  if (isAuthenticated === null) {
    <CommonLoadingSkeleton />; // or return <LoadingSpinner />
  }

  console.log(isAuthenticated);
  //if user not authenticated and trying to access a protected route
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") 
      // location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // if user is authenticated and trying to access login or register page
  if (
    isAuthenticated &&
    (location.pathname.includes("/login")
      // location.pathname.includes("/register")
    )
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/listing" />;
    }
  }

  // if user is authenticated and trying to access admin page
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // if admin is authenticated and trying to access shop page
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("/shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
