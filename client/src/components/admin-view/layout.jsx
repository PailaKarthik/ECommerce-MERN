import React, { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* admin sidebar */}

      <AdminSidebar open= {openSidebar} setOpen ={setOpenSidebar}/>
      <div className="flex-1">
        {/* admin header */}
        <AdminHeader setOpen ={setOpenSidebar} />
        {/* main content */}
        <main className=" bg-gray-700 text-white p-4 w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
