import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  ShoppingBag,
  UserRound,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  HeartIcon,
  Search,
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
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

// MenuItems component with dropdown support
const MenuItems = ({ setOpen, isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState(null);

  useEffect(() => {
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
    const parts = location.pathname.split("/");
    const last = parts[parts.length - 1] || "home";
    setActiveItem(last);
  }, [location]);

  const handleNavigateToListingPage = (menuItem, subItem = null) => {
    const id = subItem ? subItem.id : menuItem.id;
    const path = subItem ? subItem.path : menuItem.path;
    
    setActiveItem(id);

    if (id !== "home" && id !== "products" && id !== "search" && path === "/shop/listing") {
      navigate(`/shop/listing?category=${encodeURIComponent(id)}`);
    } else {
      navigate(path);
    }
    if (setOpen) setOpen(false);
  };

  const toggleMobileExpansion = (itemId) => {
    setMobileExpandedItem(mobileExpandedItem === itemId ? null : itemId);
  };

  if (isMobile) {
    return (
      <nav className="mt-4 space-y-1 text-gray-200">
        {shoppingViewHeaderMenuItems.map((menuItem) => (
          <div key={menuItem.id} className="space-y-1">
            {/* Main menu item */}
            <div
              className="py-3 px-2 cursor-pointer group"
              onClick={() => {
                if (menuItem.subItems) {
                  toggleMobileExpansion(menuItem.id);
                } else {
                  handleNavigateToListingPage(menuItem);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium text-base transition-colors duration-200 ${
                  activeItem === menuItem.id || menuItem.subItems?.some(sub => sub.id === activeItem)
                    ? "text-orange-400" 
                    : "text-gray-200 hover:text-orange-300"
                }`}>
                  {menuItem.label}
                </span>
                
                {menuItem.subItems ? (
                  <ChevronDown 
                    className={`w-4 h-4 text-orange-400 transition-transform duration-200 ${
                      mobileExpandedItem === menuItem.id ? "rotate-180" : ""
                    }`} 
                  />
                ) : (
                  <span className="text-orange-400 group-hover:translate-x-0.5 transition-transform duration-200">
                    →
                  </span>
                )}
              </div>

              {/* Active underline */}
              {(activeItem === menuItem.id || menuItem.subItems?.some(sub => sub.id === activeItem)) && (
                <div className="mt-2 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
              )}
            </div>

            {/* Sub-items for mobile */}
            {menuItem.subItems && (
              <div 
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${mobileExpandedItem === menuItem.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                <div className="ml-6 space-y-1 pt-1">
                  {menuItem.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      onClick={() => handleNavigateToListingPage(menuItem, subItem)}
                      className="py-2 px-2 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm transition-colors duration-200 ${
                          activeItem === subItem.id 
                            ? "text-orange-400" 
                            : "text-gray-300 hover:text-orange-300"
                        }`}>
                          {subItem.label}
                        </span>
                        <span className="text-xs text-orange-400 group-hover:translate-x-0.5 transition-transform duration-200">
                          →
                        </span>
                      </div>
                      
                      {/* Active underline for sub-items */}
                      {activeItem === subItem.id && (
                        <div className="mt-1 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full w-3/4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // Desktop layout with dropdowns
  return (
    <nav className="flex flex-row justify-center gap-8 text-gray-200">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="relative group">
          {menuItem.subItems ? (
            // Dropdown for items with subitems
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="py-3.5 cursor-pointer group">
                  <div className="flex items-center gap-1">
                    <span className={`font-medium text-sm transition-colors duration-200 ${
                      activeItem === menuItem.id || menuItem.subItems?.some(sub => sub.id === activeItem)
                        ? "text-orange-400"
                        : "text-gray-200 hover:text-orange-300"
                    }`}>
                      {menuItem.label}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400 transition-transform duration-200 group-hover:rotate-180" />
                  </div>
                  
                  {/* Active underline */}
                  {(activeItem === menuItem.id || menuItem.subItems?.some(sub => sub.id === activeItem)) && (
                    <div className="mt-2 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-48 bg-gray-800/95 backdrop-blur-sm text-gray-200 border border-gray-700 shadow-xl mt-1"
                align="center"
              >
                {menuItem.subItems.map((subItem) => (
                  <DropdownMenuItem
                    key={subItem.id}
                    onClick={() => handleNavigateToListingPage(menuItem, subItem)}
                    className={`
                      cursor-pointer py-2 px-3 transition-colors duration-200
                      ${activeItem === subItem.id 
                        ? "bg-orange-500/20 text-orange-300" 
                        : "hover:bg-gray-700 hover:text-orange-200"
                      }
                    `}
                  >
                    <span className="font-medium text-sm">{subItem.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Regular menu item without dropdown
            <div
              onClick={() => handleNavigateToListingPage(menuItem)}
              className="py-3 cursor-pointer"
            >
              <span className={`font-medium text-sm transition-colors duration-200 ${
                activeItem === menuItem.id
                  ? "text-orange-400"
                  : "text-gray-200 hover:text-orange-300"
              }`}>
                {menuItem.label}
              </span>
              
              {/* Active underline */}
              {activeItem === menuItem.id && (
                <div className="mt-2 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
              )}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

// Cart component
const CartButton = ({ isMobile = false }) => {
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const cartItemCount = cartItems?.items?.length || 0;

  return (
    <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
      <Button
        onClick={() => setOpenCartSheet(true)}
        className={`relative bg-transparent hover:bg-gray-900 text-gray-200 hover:text-orange-400 transition-all duration-200 group ${
          isMobile ? "p-2" : "p-2 flex items-center gap-2"
        }`}
        variant="ghost"
      >
        {cartItemCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {cartItemCount > 9 ? "9+" : cartItemCount}
          </div>
        )}
        {!isMobile && (
          <div className="flex flex-col items-start ml-1">
            <span className="text-xs text-gray-400 leading-none hover:text-gray-200">Shopping Cart:</span>
          </div>
        )}
        <HiOutlineShoppingBag className="w-6 h-6" />
      </Button>
      <UserCartWrapper
        setOpenCartSheet={setOpenCartSheet}
        cartItems={cartItems}
      />
    </Sheet>
  );
};

// User Profile Dropdown for Desktop
const UserProfileDropdown = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleButtonClick = () => {
    if (!user?.username) {
      navigate('/auth/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-3 hover:bg-gray-900  hover:border-orange-400/50 rounded-lg transition-all duration-200 hover:scale-105 group flex items-center gap-2"
          onClick={handleButtonClick}
        >
          <Avatar className="cursor-pointer ring-1 ring-gray-600 group-hover:ring-orange-400 transition-all duration-200 w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-orange-100 font-bold text-sm group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-200">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-medium text-orange-200 truncate max-w-20">
              {user?.username || "Login"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-48 bg-gray-800/95 backdrop-blur-sm text-gray-200 border border-gray-700 shadow-xl"
      >
        <DropdownMenuLabel className="flex items-center gap-2 py-2 px-3">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
            <UserRound className="w-3 h-3 text-gray-900" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-orange-200 text-sm truncate">
              {user?.username || "Guest"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || "Please login"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        {user?.username ? (
          <>
            <DropdownMenuItem
              onClick={() => navigate("/shop/account")}
              className="cursor-pointer focus:bg-gray-700 focus:text-orange-200 hover:bg-gray-700 py-2 px-3 transition-colors duration-200 group"
            >
              <ShieldCheck className="w-4 h-4 mr-2 group-hover:text-orange-400 transition-colors duration-200" />
              <span className="font-medium text-sm">Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer focus:bg-red-900/20 focus:text-red-300 hover:bg-red-900/20 py-2 px-3 transition-colors duration-200 group"
            >
              <LogOut className="w-4 h-4 mr-2 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
              <span className="font-medium text-sm text-red-300">Logout</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => navigate('/auth/login')}
            className="cursor-pointer focus:bg-gray-700 focus:text-orange-200 hover:bg-gray-700 py-2 px-3 transition-colors duration-200 group"
          >
            <UserRound className="w-4 h-4 mr-2 group-hover:text-orange-400 transition-colors duration-200" />
            <span className="font-medium text-sm">Login</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Mobile Profile Menu Component
const MobileProfileMenu = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsProfileMenuOpen(false);
  };

  return (
    <DropdownMenu open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-2 hover:bg-gray-800 transition-all duration-200 group"
        >
          <UserRound className="w-6 h-6 text-gray-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-48 bg-gray-800/95 backdrop-blur-sm text-gray-200 border border-gray-700 shadow-xl"
      >
        <DropdownMenuLabel className="flex items-center gap-2 py-2 px-3">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
            <UserRound className="w-3 h-3 text-gray-900" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-orange-200 text-sm truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          onClick={() => {
            navigate("/shop/account");
            setIsProfileMenuOpen(false);
          }}
          className="cursor-pointer focus:bg-gray-700 focus:text-orange-200 hover:bg-gray-700 py-2 px-3 transition-colors duration-200 group"
        >
          <ShieldCheck className="w-4 h-4 mr-2 group-hover:text-orange-400 transition-colors duration-200" />
          <span className="font-medium text-sm">Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer focus:bg-red-900/20 focus:text-red-300 hover:bg-red-900/20 py-2 px-3 transition-colors duration-200 group"
        >
          <LogOut className="w-4 h-4 mr-2 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
          <span className="font-medium text-sm text-red-300">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Main Header Component
const ShoppingHeader = () => {
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const phoneNumber = "8971749741";

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems({ userId: user.id }));
    }
  }, [dispatch, user]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-gray-900">
      {/* Main Header */}
      <header className="bg-gray-900/95 backdrop-blur-md text-gray-200 border-b border-gray-800 shadow-lg">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            {/* Top Row - Logo and Right Icons */}
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <Link
                to="/shop/home"
                className="flex gap-3 items-center group transition-all duration-200 hover:scale-105"
              >
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg group-hover:shadow-orange-500/25 transition-all duration-200">
                  <ShoppingBag className="w-7 h-7 text-gray-900" />
                </div>
                <span className="font-bold text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-amber-300 transition-all duration-200">
                  Urban Trendz
                </span>
              </Link>

              {/* Right Side Icons */}
              <div className="flex items-center gap-6">
                {/* Phone Button */}
                <a href={`tel:${phoneNumber}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                  <Phone className="w-5 h-5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 leading-none hover:text-gray-200">Need Help?</span>
                  </div>
                </a>
                {/* Cart Button */}
                <CartButton />

                {/* User Profile */}
                <UserProfileDropdown user={user} />
              </div>
            </div>

            {/* Bottom Row - Navigation Menu */}
            <div className="pt-4 border-t border-gray-800">
              <MenuItems />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex h-16 items-center justify-between pl-2">
            {/* Left Side - Menu + Logo */}
            <div className="flex items-center gap-1">
              {/* Mobile Menu Button */}
              <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
                <SheetTrigger asChild>
                  <Button className="bg-gray-900 hover:bg-gray-700 transition-all duration-200 hover:scale-105">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="flex flex-col w-full max-w-xs bg-gray-900/98 backdrop-blur-md border-r border-gray-800 px-4 py-4"
                >
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex gap-2 items-center">
                      <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
                        <ShoppingBag className="w-6 h-6 text-gray-900" />
                      </div>
                      <span className="text-orange-400 font-bold text-xl">
                        Urban Trendz
                      </span>
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <MenuItems setOpen={setOpenMenuSheet} isMobile={true} />
                </SheetContent>
              </Sheet>

              {/* Mobile Logo */}
              <Link
                to="/shop/home"
                className="flex gap-2 items-center group transition-all duration-200"
              >
                <span className="font-bold text-lg bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Urban Trendz
                </span>
              </Link>
            </div>

            {/* Right Side - Icons (Mobile - Icons Only) */}
            <div className="flex items-center">
              {/* Mobile Phone Icon */}
              <a href={`tel:${phoneNumber}`}>
                <Button
                  variant="ghost"
                  className="p-2 hover:bg-gray-800 transition-all duration-200 group"
                >
                  <Phone className="w-5 h-5 text-gray-200" />
                </Button>
              </a>

              {/* Mobile Cart */}
              <CartButton isMobile={true} />

              {/* Mobile Profile */}
              <MobileProfileMenu user={user} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default ShoppingHeader;