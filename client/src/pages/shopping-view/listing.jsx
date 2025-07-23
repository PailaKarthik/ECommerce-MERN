import React, { useEffect, useState, useCallback, useRef } from "react";
import ProductFilter from "@/components/shopping-view/poduct-filter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { buttonVariants } from "../../components/ui/button";
import { sortOptions } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { cn } from "@/lib/utils";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDailog from "@/components/shopping-view/productDetails";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const ShoppingLists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth); // Add isAuthenticated

  // Helper to parse filters from URL search params
  const parseFiltersFromSearch = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const result = {};
    const cat = params.get("category");
    if (cat) {
      result.category = cat
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
    }
    const brand = params.get("brand");
    if (brand) {
      result.brand = brand
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
    }
    return result;
  }, [location.search]);

  const parseSortFromSearch = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("sortBy") || "priceLowToHigh";
  }, [location.search]);

  // State for filters & sort, initialized from URL on first render
  const [filters, setFilters] = useState(() => parseFiltersFromSearch());
  const [sort, setSort] = useState(() => parseSortFromSearch());
  const [openDetailsDailog, setOpenDetailsDailog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to track first mount (for sessionStorage restore)
  const isFirstMount = useRef(true);

  // Sync filters & sort when URL search changes
  useEffect(() => {
    if (location.pathname !== "/shop/listing") return;

    const newFilters = parseFiltersFromSearch();
    setFilters((prev) => {
      const prevCat = prev.category?.join(",") || "";
      const prevBrand = prev.brand?.join(",") || "";
      const newCat = newFilters.category?.join(",") || "";
      const newBrand = newFilters.brand?.join(",") || "";
      if (prevCat !== newCat || prevBrand !== newBrand) {
        return newFilters;
      }
      return prev;
    });

    const newSort = parseSortFromSearch();
    setSort((prev) => (prev !== newSort ? newSort : prev));
  }, [
    location.search,
    location.pathname,
    parseFiltersFromSearch,
    parseSortFromSearch,
  ]);

  // Fetch products when filters or sort change
  useEffect(() => {
    if (location.pathname !== "/shop/listing") return;
    
    setIsLoading(true);
    dispatch(
      fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
    ).finally(() => {
      setIsLoading(false);
    });

    // Save current filters to sessionStorage for persistence
    const toSave = {};
    if (filters.category) toSave.category = filters.category;
    if (filters.brand) toSave.brand = filters.brand;
    try {
      sessionStorage.setItem("filters", JSON.stringify(toSave));
    } catch {
      // ignore
    }
  }, [dispatch, filters, sort, location.pathname]);

  // On first mount: if on listing without search params, restore from sessionStorage
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (location.pathname === "/shop/listing" && !location.search) {
        const saved = sessionStorage.getItem("filters");
        if (saved) {
          try {
            const obj = JSON.parse(saved);
            const params = new URLSearchParams();
            if (obj.category) params.set("category", obj.category.join(","));
            if (obj.brand) params.set("brand", obj.brand.join(","));
            const search = params.toString();
            if (search) {
              navigate({ pathname: "/shop/listing", search });
            }
          } catch {
            // invalid JSON
          }
        }
      }
    }
  }, [location.pathname, location.search, navigate]);

  const handleSort = (value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("sortBy", value);
    } else {
      params.delete("sortBy");
    }
    navigate({ pathname: "/shop/listing", search: params.toString() });
  };

  // Toggle a filter option in URL/search params
  const handleFilter = (section, optionId) => {
    if (location.pathname !== "/shop/listing") {
      navigate(`/shop/listing?${section}=${encodeURIComponent(optionId)}`);
      return;
    }
    const params = new URLSearchParams(location.search);
    let arr = [];
    const val = params.get(section);
    if (val) {
      arr = val
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
    }
    const idx = arr.indexOf(optionId);
    if (idx === -1) {
      arr.push(optionId);
    } else {
      arr.splice(idx, 1);
    }

    if (arr.length) {
      params.set(section, arr.join(","));
    } else {
      params.delete(section);
    }
    navigate({ pathname: "/shop/listing", search: params.toString() });
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleAddToCart = (productId, getTotalStock, size) => {
    console.log("size", size);
    
    if (size === null) {
      toast(`Enter the size of the product`, {
        icon: "❌",
        duration: 2000,
        position: "top-center",
        style: { backgroundColor: "#1f2937", color: "#f9fafb" },
      });
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast("Please login to add items to cart", {
        icon: "🔒",
        duration: 2000,
        position: "top-center",
        style: { backgroundColor: "#1f2937", color: "#f9fafb" },
      });
      // Store the product details for after login (optional)
      sessionStorage.setItem('pendingCartItem', JSON.stringify({
        productId,
        quantity: 1,
        size
      }));
      navigate('/auth/login');
      return;
    }

    // Check stock availability for authenticated users
    let items = cartItems.items || [];
    if (items.length) {
      const idx = items.findIndex((item) => item.productId == productId);
      if (idx > -1) {
        const qty = items[idx].quantity;
        if (qty + 1 > getTotalStock) {
          toast(`Only ${qty} quantity can be added for this item`, {
            icon: "❌",
            duration: 2000,
            position: "top-center",
            style: { backgroundColor: "#1f2937", color: "#f9fafb" },
          });
          return;
        }
      }
    }

    // If user is authenticated, proceed with existing logic
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1, size: size })).then(
      (response) => {
        if (response.payload?.success) {
          dispatch(fetchCartItems({ userId: user?.id }));
          toast(response.payload.message, {
            icon: "✅",
            duration: 1000,
            position: "top-center",
            style: { backgroundColor: "#065f46", color: "#f9fafb" },
          });
        }
      }
    );
  };

  // Open product details dialog when details arrive
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDailog(true);
    }
  }, [productDetails]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 p-4 lg:p-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-700 rounded-xl aspect-square mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header with Glassmorphism */}
        <div className="sticky top-0 z-10 backdrop-blur-lg bg-gray-900/80 border-b border-gray-700/50 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                All Products
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {productList.length} items available
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 border-gray-600/50 text-gray-100 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  )}
                >
                  <ArrowUpDownIcon className="w-4 h-4" />
                  <span className="text-sm">Sort</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[180px] bg-gray-800/95 backdrop-blur-lg border-gray-600/50"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.id}
                      value={option.id}
                      className="text-gray-200 hover:bg-gray-700/50 focus:bg-gray-700/50"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Filters - Keep original unchanged */}
        <div className="p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
          <ProductFilter filters={filters} handleFilter={handleFilter} />
        </div>

        {/* Mobile Product Grid */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="grid grid-cols-2 gap-4"
              >
                {productList.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.05,
                      ease: "easeOut" 
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="transform transition-all duration-300"
                  >
                    <ShoppingProductTile
                      product={product}
                      handleGetProductDetails={handleGetProductDetails}
                      handleAddToCart={handleAddToCart}
                      isMobile={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[300px_1fr] gap-8 p-6">
        {/* Desktop Sidebar with Enhanced Design */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl sticky top-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Filters
              </h3>
              <p className="text-sm text-gray-400 mt-1">Refine your search</p>
            </div>
            <ProductFilter filters={filters} handleFilter={handleFilter} />
          </div>
        </div>

        {/* Desktop Content */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl overflow-hidden">
          {/* Desktop Header with Gradient */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-lg p-8 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
                  All Products
                </h2>
                <p className="text-gray-400">Discover our premium collection</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-600/30">
                  <span className="text-gray-200 font-medium">
                    {productList.length} Products
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "bg-gray-700/80 hover:bg-gray-600/80 border-gray-600/50 text-gray-100 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                      )}
                    >
                      <ArrowUpDownIcon className="w-4 h-4 mr-2" />
                      <span>Sort by</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[200px] bg-gray-800/95 backdrop-blur-lg border-gray-600/50"
                  >
                    <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                      {sortOptions.map((option) => (
                        <DropdownMenuRadioItem
                          key={option.id}
                          value={option.id}
                          className="text-gray-200 hover:bg-gray-700/50 focus:bg-gray-700/50"
                        >
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Desktop Product Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="grid grid-cols-4 gap-8 p-8"
              >
                {productList.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.03,
                      ease: "easeOut" 
                    }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    <ShoppingProductTile
                      product={product}
                      handleGetProductDetails={handleGetProductDetails}
                      handleAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Empty State */}
          {!isLoading && productList.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative mb-8">
                <div className="text-8xl opacity-20">🛍️</div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent mb-3">
                No products found
              </h3>
              <p className="text-gray-500 text-lg max-w-md">
                Try adjusting your filters or search criteria to discover amazing products
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Product Details Dialog */}
      {productDetails && (
        <ProductDetailsDailog
          handleAddToCart={handleAddToCart}
          open={openDetailsDailog}
          setOpen={setOpenDetailsDailog}
          productDetails={productDetails}
        />
      )}
    </div>
  );
};

export default ShoppingLists;