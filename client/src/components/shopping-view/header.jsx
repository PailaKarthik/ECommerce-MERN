import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  ShoppingBag,
  UserRound,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "../../config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {  resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Link, useNavigate, useLocation } from "react-router-dom";
// ... other imports

const MenuItems = ({ setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

  // Sync activeItem from URL (so highlight persists on refresh):
  useEffect(() => {
    // If on listing page with ?category=..., use that
    if (location.pathname === "/shop/listing") {
      const cat = new URLSearchParams(location.search).get("category");
      if (cat) {
        setActiveItem(cat);
        return;
      } else {
        setActiveItem("products");
        return;
      }
    }
    // Otherwise derive from pathname, e.g. "/shop/home" → "home"
    const parts = location.pathname.split("/");
    const last = parts[parts.length - 1] || "home";
    setActiveItem(last);
  }, [location]);

  const handleNavigateToListingPage = (menuItem) => {
    const id = menuItem.id;
    setActiveItem(id);

    if (id !== "home" && id !== "products" && id !== "search") {
      // Always navigate explicitly to listing with category query
      navigate(`/shop/listing?category=${encodeURIComponent(id)}`);
    } else {
      navigate(menuItem.path);
    }
    if (setOpen) setOpen(false);
  };

  return (
    <nav className="mt-4 lg:mt-0 flex flex-col lg:flex-row text-gray-200 lg:gap-2">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => handleNavigateToListingPage(menuItem)}
          className={`${
            activeItem === menuItem.id ? "bg-gray-700 lg:rounded-md" : ""
          } p-2 cursor-pointer border-b lg:border-0 border-gray-500 flex justify-between`}
        >
          {menuItem.label}
          <span className="lg:hidden">⇢</span>
        </div>
      ))}
    </nav>
  );
};

const HeaderRightContent = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.shoppingCart);

  const handleLogout = () => {
    // dispatch(logoutUser());
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  };

  useEffect(() => {
    dispatch(fetchCartItems({ userId: user?.id }));
  }, [dispatch, user]);

  console.log("Cart Items:", cartItems);
  return (
    <div className="relative flex gap-2 items-center">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => {
            setOpenCartSheet(true);
          }}
          className="relative bg-gray-900 md:hover:bg-gray-800 text-orange-100 "
        >
          {cartItems?.items?.length > 0 && (
            <div className="absolute top-0 right-0 text-[10px] font-semibold text-gray-100 bg-orange-400 rounded-full w-3.5">
              {cartItems?.items?.length}
            </div>
          )}

          <ShoppingCart className="w-5 h-5" />
          <span className="lg:sr-only ">User Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems}
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback className="bg-gray-700 text-orange-100 font-bold">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          className="absolute top-0 w-48 lg:right-6 lg:top-4 bg-gray-700 text-gray-200 border-gray-600"
        >
          <DropdownMenuLabel className="flex items-center gap-1">
            <UserRound className="w-5 h-5" />
            <span className="uppercase ">{user.username}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-500" />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer focus:bg-gray-600 focus:text-white"
          >
            <ShieldCheck />
            <span className="text-md font-semibold">Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer focus:bg-gray-600 focus:text-white"
          >
            <LogOut className="text-red-300" />
            <span className="text-md font-semibold">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ShoppingHeader = () => {
  open;
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  return (
    <header className="sticky top-0 z-40 w-full bg-gray-900 text-gray-200 shadow-gray-700 shadow-sm ">
      <div className="flex h-18 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex gap-1 items-center ">
          <ShoppingBag />
          <span className="text-orange-400 font-bold text-xl md:text-2xl hover:text-amber-500">
            ECommerce
          </span>
        </Link>
        <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
          <SheetTrigger asChild>
            <Button className="lg:hidden bg-gray-900 hover:bg-gray-800 shadow-sm shadow-gray-600">
              <Menu />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col w-full max-w-xs bg-gray-800 px-4 py-6"
          >
            <MenuItems setOpen={setOpenMenuSheet} />
            <HeaderRightContent user={user} />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block ">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent user={user} />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
