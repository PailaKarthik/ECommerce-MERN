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
import { motion } from "framer-motion";

const SearchProducts = () => {
  const [keyword, setkeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shoppingSearch);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shoppingProducts);

  const [openDetailsDailog, setOpenDetailsDailog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (keyword && keyword.trim !== "") {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
    }
  }, [keyword, setSearchParams, dispatch]);

  const handleAddToCart = (productId, getTotalStock) => {
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
              backgroundColor: "black",
              color: "white",
            },
          });
          return;
        }
      }
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then(
      (response) => {
        if (response.payload?.success) {
          dispatch(fetchCartItems({ userId: user?.id }));
          toast(response?.payload.message, {
            icon: "✅",
            duration: 1000,
            position: "top-center",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });
        }
      }
    );
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDailog(true);
    }
  }, [productDetails]);

  console.log(searchParams, "SearchParams");
  console.log(searchResults);

  return (
    <motion.div
      initial={{ opacity: 30, scale: 1.01 }}
      animate={{ opacity: 100, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 text-gray-200 px-4 md:px-8 lg:px-20 py-8 min-h-screen"
    >
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name={keyword}
            onChange={(e) => setkeyword(e.target.value)}
            className="py-6 border-gray-400"
            placeholder="Search Products...."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-3xl font-extrabold text-gray-300">
          No results found
        </h1>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            product={item}
            handleAddToCart={handleAddToCart}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailsDailog
        handleAddToCart={handleAddToCart}
        open={openDetailsDailog}
        setOpen={setOpenDetailsDailog}
        productDetails={productDetails}
      />
    </motion.div>
  );
};

export default SearchProducts;
