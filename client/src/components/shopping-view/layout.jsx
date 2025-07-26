import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";

const ShpppingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex-1 mt-16 lg:mt-37 overflow-auto scrollbar-hide">
        <Outlet />
      </main>
      <ShoppingFooter />
    </div>
  );
};

export default ShpppingLayout;
