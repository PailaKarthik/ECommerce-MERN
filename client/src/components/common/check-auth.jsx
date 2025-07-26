import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import CommonLoadingSkeleton from "./loading-comp";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  // Add debugging to see what's happening
  console.log("CheckAuth Debug:", {
    isAuthenticated,
    userRole: user?.role,
    currentPath: location.pathname
  });

  // If authentication is still being checked, show loading
  if (isAuthenticated === null) {
    return <CommonLoadingSkeleton />;
  }

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/shop/checkout",
    "/shop/account", 
    "/shop/orders",
    "/admin"
  ];

  // Check if current path requires authentication
  const requiresAuth = protectedRoutes.some(route => 
    location.pathname.includes(route)
  );

  // Root path handling - redirect to appropriate dashboard based on role
  if (location.pathname === "/") {
    if (isAuthenticated && user?.role === "admin") {
      console.log("Redirecting admin to dashboard from root");
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/shop/home" replace />;
    }
  }

  // If user is authenticated and trying to access login or register page
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      console.log("Redirecting admin to dashboard from auth page");
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/shop/home" replace />;
    }
  }

  // If admin is authenticated and trying to access shop protected pages
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    (location.pathname.includes("/shop/checkout") || 
     location.pathname.includes("/shop/account") ||
     location.pathname.includes("/shop/orders"))
  ) {
    console.log("Redirecting admin from shop protected pages to dashboard");
    return <Navigate to="/admin/dashboard" replace />;
  }

  // NEW: If admin is authenticated and trying to access any shop page (except listing for browsing)
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.startsWith("/shop") &&
    !location.pathname.includes("/listing") &&
    !location.pathname.includes("/search")
  ) {
    console.log("Redirecting admin from shop pages to dashboard");
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If user not authenticated and trying to access protected routes
  if (!isAuthenticated && requiresAuth) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is authenticated and trying to access admin page without admin role
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" replace />;
  }

  // Allow access to the requested route
  return <>{children}</>;
};

export default CheckAuth;
