import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex flex-col md:flex min-h-screen md:flex-row overflow-hidden">
      <div className="flex-1 bg-gray-900 md:w-1/2 flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-white text-center text-4xl font-bold md:font-extrabold py-4 hover:scale-105 transition-transform duration-300">
            Welcome to <br />
            <span className="text-orange-400">ECommerce Shopping</span>
          </h1>
        </div>
      </div>
      <div 
      className="flex-1 bg-gray-200 p-6 flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
