import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <ShoppingCart />,
  },
];

function MenuItems({ setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const parts = location.pathname.split("/");
    const last = parts[parts.length - 1] || "dashboard";
    setActiveItem(last);
  },[location])

  return (
    <nav className="mt-2 flex-col flex gap-0.5">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          onClick={() => {
            setActiveItem(menuItem.id);
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          key={menuItem.id}
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-900 ${
            activeItem === menuItem.id ? "bg-gray-900" : ""
          }`}
        >
          <span className="text-gray-400">{menuItem.icon}</span>
          <span className="font-semibold ">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

const AdminSidebar = ({ open, setOpen }) => {
  return (
    <Fragment>
      {/* for mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <aside className="bg-gray-800 text-white lg:block border-r border-gray-700 h-full">
            <div className="p-4 cursor-pointer">
              <h2 className="flex gap-2 text-xl font-extrabold text-orange-400 items-center">
                <ChartNoAxesCombined /> Admin Panel
              </h2>
            </div>
            <MenuItems setOpen={setOpen} />
          </aside>
        </SheetContent>
      </Sheet>

      {/* for laptop */}
      <aside className="hidden w-64 bg-gray-800 text-white lg:block border-r border-gray-700">
        <div className="p-4 cursor-pointer">
          <h2 className="flex gap-2 text-xl font-extrabold text-orange-400 items-center">
            <ChartNoAxesCombined /> Admin Panel
          </h2>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
};

export default AdminSidebar;
