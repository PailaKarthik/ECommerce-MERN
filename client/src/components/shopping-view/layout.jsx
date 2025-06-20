import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

const ShpppingLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ShpppingLayout;
