import React, { useEffect } from "react";
import { useRoutes } from "react-router";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
// import AuthRegister from "./pages/auth/register";
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
import { Navigate } from "react-router-dom";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import AuthRegister from "./pages/auth/register";

const App = () => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // const token = JSON.parse(sessionStorage.getItem("token"));
    // dispatch(checkAuth(token));
    dispatch(checkAuth());
  }, [dispatch]);

  const allRoutes = useRoutes([
    {
      path: "/",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}></CheckAuth>
      ),
    },
    {
      path: "/auth",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AuthLayout />
        </CheckAuth>
      ),
      children: [
        {
          path: "login",
          element: <AuthLogin />,
        },
        {
          path: "register",
          element: <AuthRegister />,
        },
      ],
    },

    {
      path: "/admin",
      element: (
        <CheckAuth
          isAuthenticated={isLoading ? null : isAuthenticated}
          user={user}
        >
          {isLoading ? <CommonLoadingSkeleton /> : <AdminLayout />}
        </CheckAuth>
      ),
      children: [
        {
          path: "",
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "products",
          element: <AdminProducts />,
        },
        {
          path: "orders",
          element: <AdminOrders />,
        },
      ],
    },

    {
      path: "/shop",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingLayout />
        </CheckAuth>
      ),
      children: [
        {
          path: "home",
          element: <ShoppingHome />,
        },
        {
          path: "account",
          element: <ShoppingAccount />,
        },
        {
          path: "checkout",
          element: <ShoppingCheckout />,
        },
        {
          path: "listing",
          element: <ShoppingLists />,
        },
        {
          path: "paypal-return",
          element: <PaypalReturnPage />,
        },
        {
          path: "razorpay-success",
          element: <PaymentSuccessPage />,
        },
        {
          path: "search",
          element: <SearchProducts />,
        },
      ],
    },

    {
      path: "*",
      element: <PageNotFound />,
    },

    {
      path: "/unauth-page",
      element: <UnAuthPage />,
    },
  ]);

  if (isLoading) {
    return <CommonLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">{allRoutes}</div>
  );
};

export default App;
