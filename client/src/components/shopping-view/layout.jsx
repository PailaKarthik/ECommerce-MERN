import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";

const ShpppingLayout = () => {
  return (
    <div className="flex flex-col">
      {/* common header */}
      <ShoppingHeader />
      <main className="pt-14 flex-1 overflow-auto scrollbar-hide">
        <Outlet />
      </main>
      <ShoppingFooter />
    </div>
  );
};

export default ShpppingLayout;
