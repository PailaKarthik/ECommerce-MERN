import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchParams, useNavigate } from "react-router-dom"; // Add useNavigate
import { useDispatch, useSelector } from "react-redux";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailsDailog from "@/components/shopping-view/productDetails";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, TrendingUp, Clock } from "lucide-react";

const SearchProducts = () => {
  const [keyword, setkeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate(); // Add navigate

  const { searchResults } = useSelector((state) => state.shoppingSearch);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth); // Add isAuthenticated
  const { productDetails } = useSelector((state) => state.shoppingProducts);

  const [openDetailsDailog, setOpenDetailsDailog] = useState(false);
  const dispatch = useDispatch();

  // Trending searches with better mobile-friendly names
  const trendingSearches = [
    "Jockey",
    "Shirts",
    "Combos",
    "Pants",
    "Clothing",
    "Dresses",
  ];

  // Load recent searches from memory (you could use localStorage if needed elsewhere)
  useEffect(() => {
    // This would normally load from localStorage, but we'll use memory for now
    setRecentSearches([]);
  }, []);

  useEffect(() => {
    if (keyword && keyword.trim() !== "") {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).finally(() => {
          setIsSearching(false);
        });

        // Add to recent searches
        if (!recentSearches.includes(keyword)) {
          setRecentSearches((prev) => [keyword, ...prev.slice(0, 4)]); // Keep only 5 recent
        }
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
      setIsSearching(false);
    }
  }, [keyword, setSearchParams, dispatch, recentSearches]);

  const handleAddToCart = (productId, getTotalStock, size) => {
    if (size === null) {
      toast("Enter the size of the product", {
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
      sessionStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          productId,
          quantity: 1,
          size,
        })
      );
      navigate("/auth/login");
      return;
    }

    // Check stock availability for authenticated users
    console.log(cartItems);
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId == productId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`, {
            icon: "❌",
            duration: 2000,
            position: "top-center",
            style: {
              backgroundColor: "#1f2937",
              color: "#f9fafb",
            },
          });
          return;
        }
      }
    }

    // If user is authenticated, proceed with existing logic
    dispatch(
      addToCart({ userId: user?.id, productId, quantity: 1, size: size })
    ).then((response) => {
      if (response.payload?.success) {
        dispatch(fetchCartItems({ userId: user?.id }));
        toast(response?.payload.message, {
          icon: "✅",
          duration: 1000,
          position: "top-center",
          style: {
            backgroundColor: "#065f46",
            color: "#f9fafb",
          },
        });
      }
    });
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleSuggestionClick = (searchTerm) => {
    setkeyword(searchTerm);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setkeyword("");
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => setShowSuggestions(false), 150);
  };

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDailog(true);
    }
  }, [productDetails]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-700/50 rounded-xl aspect-square mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  console.log(searchParams, "SearchParams");
  console.log(searchResults);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Simplified Header */}
      <div className="relative">
        <div className="px-4 md:px-8 lg:px-20 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Simple Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                Search Products
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Find what you're looking for
              </p>
            </div>

            {/* Search Bar Container */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  value={keyword}
                  onChange={(e) => setkeyword(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="pl-12 pr-12 py-3 md:py-4 text-white bg-gray-800/90 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-500"
                  placeholder="Search products..."
                />
                {keyword && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && !keyword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-300">
                            Recent
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(search)}
                              className="px-3 py-1.5 bg-gray-700/60 hover:bg-gray-600/60 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Searches */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-gray-300">
                          Trending
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {trendingSearches.map((trend, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(trend)}
                            className="px-3 py-2 bg-gray-700/40 hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent rounded-lg text-sm text-gray-300 hover:text-blue-300 transition-all text-left"
                          >
                            {trend}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 md:px-8 lg:px-20 pb-16">
        {/* Search Results Header */}
        {keyword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  Results for "{keyword}"
                </h2>
                {!isSearching && (
                  <p className="text-gray-400 text-sm">
                    {searchResults.length}{" "}
                    {searchResults.length === 1 ? "product" : "products"} found
                  </p>
                )}
              </div>
              {!isSearching && searchResults.length > 0 && (
                <div className="bg-blue-600/20 px-3 py-1 rounded-full">
                  <span className="text-blue-300 text-sm font-medium">
                    {searchResults.length} Results
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {isSearching && <LoadingSkeleton />}

        {/* No Results */}
        {!isSearching && keyword && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 mb-6">
              Try different keywords or check the spelling
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Results Grid */}
        {!isSearching && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {searchResults.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                whileHover={{ y: -4 }}
                className="transform transition-transform"
              >
                <ShoppingProductTile
                  product={item}
                  handleAddToCart={handleAddToCart}
                  handleGetProductDetails={handleGetProductDetails}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Welcome State - Only show when not searching, no keyword, and suggestions not visible */}
        {!keyword && !showSuggestions && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="mb-6">
              <Sparkles className="w-12 h-12 text-blue-400/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Ready to explore?
              </h3>
              <p className="text-gray-500">
                Click the search bar to see trending products and start your
                search
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDailog
        handleAddToCart={handleAddToCart}
        open={openDetailsDailog}
        setOpen={setOpenDetailsDailog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default SearchProducts;
