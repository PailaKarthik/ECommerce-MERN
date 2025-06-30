import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

const ShpppingLayout = () => {
  return (
    <div className="flex flex-col">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex-1 overflow-auto scrollbar-hide">
        <Outlet />
      </main>
    </div>
  );
};

export default ShpppingLayout;
