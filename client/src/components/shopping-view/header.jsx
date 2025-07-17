import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  ShoppingBag,
  UserRound,
  LogOut,
  ShieldCheck,
  ChevronDown, // Added for the accordion
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

// MenuItems component remains unchanged
const MenuItems = ({ setOpen, isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

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

  const handleNavigateToListingPage = (menuItem) => {
    const id = menuItem.id;
    setActiveItem(id);

    if (id !== "home" && id !== "products" && id !== "search") {
      navigate(`/shop/listing?category=${encodeURIComponent(id)}`);
    } else {
      navigate(menuItem.path);
    }
    if (setOpen) setOpen(false);
  };

  return (
    <nav
      className={`${isMobile ? "mt-3" : "lg:mt-0"} flex ${
        isMobile ? "flex-col space-y-1" : "flex-col lg:flex-row"
      } text-gray-200`}
    >
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => handleNavigateToListingPage(menuItem)}
          className={`
      ${
        activeItem === menuItem.id
          ? "bg-gray-700 text-orange-300 lg:bg-gray-800/60"
          : "hover:bg-gray-800/40 hover:text-orange-200"
      } 
      ${
        isMobile
          ? "px-3 py-2 rounded border border-gray-700/50 transition-all duration-200"
          : "px-3 py-1.5 lg:rounded transition-all duration-200 hover:scale-105 text-md"
      }
      cursor-pointer group relative overflow-hidden
     `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <div className="relative flex items-center justify-between">
            <span className="font-medium transition-colors duration-200 truncate">
              {menuItem.label}
            </span>
            {isMobile && (
              <span className="text-orange-400 group-hover:translate-x-0.5 transition-transform duration-200 ml-2">
                →
              </span>
            )}
          </div>

          {/* Active indicator */}
          {activeItem === menuItem.id && !isMobile && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
          )}
        </div>
      ))}
    </nav>
  );
};

// New separate cart component for reusability
const CartButton = ({ isMobile = false }) => {
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const cartItemCount = cartItems?.items?.length || 0;

  return (
    <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
      <Button
        onClick={() => setOpenCartSheet(true)}
        className={`relative bg-gray-900 hover:bg-gray-800 border border-gray-700 text-orange-100 transition-all duration-200 hover:border-gray-600 hover:scale-105 group p-2 ${
          isMobile ? "w-full justify-center" : ""
        }`}
      >
        {cartItemCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
            {cartItemCount > 9 ? "9+" : cartItemCount}
          </div>
        )}
        <ShoppingCart className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-200" />
        {isMobile && <span className="ml-2 font-semibold">View Cart</span>}
      </Button>
      <UserCartWrapper
        setOpenCartSheet={setOpenCartSheet}
        cartItems={cartItems}
      />
    </Sheet>
  );
};

const HeaderRightContent = ({ user, isMobile = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // State for the new mobile accordion menu
  const [isUserMenuExpanded, setIsUserMenuExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Reusable menu item component for the mobile accordion
  const MobileMenuItem = ({ icon, label, onClick, isDestructive = false }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-2.5 text-left rounded-md transition-colors duration-200 group ${
        isDestructive
          ? "text-red-300 hover:bg-red-900/40"
          : "text-gray-300 hover:bg-gray-700/80 hover:text-orange-200"
      }`}
    >
      {React.cloneElement(icon, {
        className: `w-4 h-4 mr-3 transition-colors duration-200 ${
          isDestructive
            ? "group-hover:text-red-300"
            : "group-hover:text-orange-400"
        }`,
      })}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div
      className={`flex gap-2 items-center ${
        isMobile ? "mt-auto pt-3 border-t border-gray-700 flex-col w-full" : ""
      }`}
    >
      {/* --- CART BUTTON (Only for Desktop) --- */}
      {!isMobile && (
        <CartButton isMobile={false} />
      )}

      {/* --- USER MENU (Conditional Rendering based on isMobile) --- */}
      {isMobile ? (
        // --- Mobile Accordion Menu (without cart) ---
        <div className="w-full bg-gray-800/50 rounded-lg p-2 border border-gray-700/80">
          {/* Accordion Trigger */}
          <button
            onClick={() => setIsUserMenuExpanded(!isUserMenuExpanded)}
            className="w-full flex items-center justify-between text-left p-2 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="w-8 h-8 ring-1 ring-gray-600">
                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-orange-100 font-bold text-sm">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-orange-200 text-sm truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                isUserMenuExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Accordion Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isUserMenuExpanded ? "max-h-40 mt-2" : "max-h-0"
            }`}
          >
            <div className="pt-2 border-t border-gray-700/80 flex flex-col gap-1">
              <MobileMenuItem
                icon={<ShieldCheck />}
                label="Account"
                onClick={() => navigate("/shop/account")}
              />
              <MobileMenuItem
                icon={<LogOut />}
                label="Logout"
                onClick={handleLogout}
                isDestructive
              />
            </div>
          </div>
        </div>
      ) : (
        // --- Original Desktop Dropdown Menu ---
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative p-1 hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-105 group"
            >
              <Avatar className="cursor-pointer ring-1 ring-gray-700 group-hover:ring-orange-400 transition-all duration-200 w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-orange-100 font-bold text-sm group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-200">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
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
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
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
          className="relative p-1 hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-105 group"
        >
          <Avatar className="cursor-pointer ring-1 ring-gray-700 group-hover:ring-orange-400 transition-all duration-200 w-7 h-7">
            <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-orange-100 font-bold text-xs group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-200">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
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

// ShoppingHeader component with restructured mobile layout
const ShoppingHeader = () => {
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Fetch cart items when user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems({ userId: user.id }));
    }
  }, [dispatch, user]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gray-900/95 backdrop-blur-md text-gray-200 border-b border-gray-800 shadow-lg">
      <div className="flex h-14 items-center justify-between px-3 md:px-4 max-w-7xl mx-auto">
        {/* Left Side - Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
            <SheetTrigger asChild>
              <Button className="lg:hidden bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-200 hover:scale-105 p-2">
                <Menu className="w-3.5 h-3.5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="flex flex-col w-full max-w-xs bg-gray-900/98 backdrop-blur-md border-r border-gray-800 px-4 py-4"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded">
                    <ShoppingBag className="w-4 h-4 text-gray-900" />
                  </div>
                  <span className="text-orange-400 font-bold">Urban Trendz</span>
                </div>
              </div>

              {/* Mobile Menu Items (Navigation Only) */}
              <MenuItems setOpen={setOpenMenuSheet} isMobile={true} />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            to="/shop/home"
            className="flex gap-1.5 items-center group transition-all duration-200 hover:scale-105"
          >
            <div className="hidden lg:block p-1.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded shadow-md group-hover:shadow-orange-500/25 transition-all duration-200">
              <ShoppingBag className="w-4 h-4 text-gray-900" />
            </div>
            <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-amber-300 transition-all duration-200">
              Urban Trendz
            </span>
          </Link>
        </div>

        {/* Right Side - Different for Mobile and Desktop */}
        <div className="flex items-center gap-2">
          {/* Mobile Right Side - Cart + Profile */}
          <div className="flex items-center gap-2 lg:hidden">
            <CartButton isMobile={false} />
            <MobileProfileMenu user={user} />
          </div>
          
          {/* Desktop Right Side - Menu + User Section */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <MenuItems />
            <HeaderRightContent user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;