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
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const ShoppingLists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);

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
    // Add other filter sections similarly if needed
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

  // Ref to track first mount (for sessionStorage restore)
  const isFirstMount = useRef(true);

  // Sync filters & sort when URL search changes,
  // but only update state if actually different
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
  }, [location.search, location.pathname, parseFiltersFromSearch, parseSortFromSearch]);

  // Fetch products when filters or sort change
  useEffect(() => {
    if (location.pathname !== "/shop/listing") return;
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));

    // Save current filters to sessionStorage for persistence
    const toSave = {};
    if (filters.category) toSave.category = filters.category;
    if (filters.brand) toSave.brand = filters.brand;
    // ...other sections if any
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
            // ...other sections
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
      // navigate fresh with just this one filter
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

  const handleAddToCart = (productId, getTotalStock) => {
    let items = cartItems.items || [];
    if (items.length) {
      const idx = items.findIndex((item) => item.productId == productId);
      if (idx > -1) {
        const qty = items[idx].quantity;
        if (qty + 1 > getTotalStock) {
          toast(`only ${qty} quantity can be added for this item`, {
            icon: "❌",
            duration: 2000,
            position: "top-center",
            style: { backgroundColor: "black", color: "white" },
          });
          return;
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then(
      (response) => {
        if (response.payload?.success) {
          dispatch(fetchCartItems({ userId: user?.id }));
          toast(response.payload.message, {
            icon: "✅",
            duration: 1000,
            position: "top-center",
            style: { backgroundColor: "black", color: "white" },
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

  return (
    <div className="bg-gray-900 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 p-4 text-gray-100 lg:min-h-screen">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="w-full shadow-sm shadow-gray-600">
        <div className="p-4 bg-gray-800 border-gray-500 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-300">{productList.length} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex items-center gap-2 bg-gray-700 hover:bg-gray-800 hover:text-white border-gray-400"
                  )}
                >
                  <ArrowUpDownIcon />
                  <span>Sort by</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] bg-gray-700"
              >
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={handleSort}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.id}
                      value={option.id}
                      className="text-gray-200 hover:text-gray-400"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeIn" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
        >
          {productList.map((product) => (
            <ShoppingProductTile
              key={product._id}
              product={product}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </motion.div>

        <ProductDetailsDailog
          handleAddToCart={handleAddToCart}
          open={openDetailsDailog}
          setOpen={setOpenDetailsDailog}
          productDetails={productDetails}
        />
      </div>
    </div>
  );
};

export default ShoppingLists;
