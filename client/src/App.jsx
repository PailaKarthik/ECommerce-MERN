import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import PageNotFound from "./pages/pageNotFound";
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingLists from "./pages/shopping-view/listing";
import CheckAuth from "./components/common/check-auth";
import UnAuthPage from "./pages/unAuth-Page";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import CommonLoadingSkeleton from "./components/common/loading-comp";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import AuthRegister from "./pages/auth/register";
import ScrollToTop from "./components/common/ScrollToTop";

// Import the new components (you'll create these)
import TermsOfService from "./pages/about/terms-of-service";
import PrivacyPolicy from "./pages/about/privacy-policy";
import ShippingPolicy from "./pages/about/shopping-policy";

const App = () => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading skeleton while authentication is being checked
  if (isLoading) {
    return <CommonLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
        <ScrollToTop/>
      <Routes>
        {/* Root path */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <div>Redirecting...</div>
            </CheckAuth>
          }
        />

        {/* Auth routes */}
        <Route
          path="/auth/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* Shop routes */}
        <Route
          path="/shop/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="listing" element={<ShoppingLists />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="razorpay-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />

          {/* About/Info pages */}
          <Route
            path="about/terms-of-service"
            element={<TermsOfService />}
          />
          <Route path="about/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="about/shipping-policy" element={<ShippingPolicy />} />
        </Route>

        {/* Unauthorized page */}
        <Route path="/unauth-page" element={<UnAuthPage />} />

        {/* 404 page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
