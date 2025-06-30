import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router";
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
import { Search, X, Sparkles, TrendingUp } from "lucide-react";

const SearchProducts = () => {
  const [keyword, setkeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { searchResults } = useSelector((state) => state.shoppingSearch);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shoppingProducts);

  const [openDetailsDailog, setOpenDetailsDailog] = useState(false);
  const dispatch = useDispatch();

  // Sample trending searches - you can replace with actual data
  const trendingSearches = [
    "Sneakers", "Hoodies", "Dresses", "Jeans", "Accessories", "Bags"
  ];

  useEffect(() => {
    if (keyword && keyword.trim() !== "") {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).finally(() => {
          setIsSearching(false);
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
      setIsSearching(false);
    }
  }, [keyword, setSearchParams, dispatch]);

  const handleAddToCart = (productId, getTotalStock, size) => {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId == productId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`only ${getQuantity} quantity can be added for this item`, {
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

    if (size === null) {
      toast(`enter the size of the product`, {
        icon: "❌",
        duration: 2000,
        position: "top-center",
        style: { backgroundColor: "#1f2937", color: "#f9fafb" },
      });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1, size: size })).then(
      (response) => {
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
      }
    );
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleTrendingClick = (trend) => {
    setkeyword(trend);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setkeyword("");
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  const handleBlur = (e) => {
    // Delay hiding suggestions to allow clicking on trending buttons
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDailog(true);
    }
  }, [productDetails]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-700/50 rounded-xl aspect-square mb-4"></div>
          <div className="space-y-3">
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
      {/* Reduced Hero Section with Search */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/50 to-gray-900"></div>
        
        <div className="relative px-4 md:px-8 lg:px-20 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Reduced Title */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">
                Find Your Perfect Product
              </h1>
              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                Search through thousands of premium products and discover exactly what you're looking for
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <Input
                  value={keyword}
                  onChange={(e) => setkeyword(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={handleBlur}
                  className="pl-12 pr-12 py-4 md:py-6 text-base md:text-lg text-gray-300 bg-gray-800/80 backdrop-blur-lg border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 placeholder:text-gray-500"
                  placeholder="Search for products, brands, categories..."
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

              {/* Trending Suggestions */}
              <AnimatePresence>
                {showSuggestions && !keyword && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6 shadow-2xl z-50"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((trend, index) => (
                        <button
                          key={index}
                          onClick={() => handleTrendingClick(trend)}
                          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                        >
                          {trend}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="px-4 py-2 md:px-8 lg:px-20 pb-16">
        {/* Results Header */}
        {keyword && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-1">
                  Search Results for "{keyword}"
                </h2>
                <p className="text-gray-400">
                  {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              {searchResults.length > 0 && (
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm px-2 py-1 md:px-4 md:py-2 rounded-full border border-gray-600/30">
                  <span className="text-gray-200 font-medium">
                    {searchResults.length} Results
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isSearching && <LoadingSkeleton />}

        {/* No Results State */}
        {!isSearching && keyword && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="relative mb-8">
              <div className="text-6xl opacity-20">🔍</div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent mb-3">
              No results found
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto mb-6">
              We couldn't find any products matching "{keyword}". Try different keywords or browse our categories.
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
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
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {searchResults.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  ease: "easeOut" 
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
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

        {/* Welcome State - Only show when no keyword AND no suggestions are visible */}
        {!keyword && !showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="relative mb-8">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent mb-3">
              Start Your Search Journey
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Enter a keyword above to discover amazing products tailored just for you
            </p>
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