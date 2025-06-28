import { Minus, Plus, Trash } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  upadteCartItemQuantity,
} from "../../store/shop/cart-slice";
import { toast } from "sonner";
import { motion } from "framer-motion";

const UserCartItemsContent = ({ cartItem, mode }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shoppingProducts);

  const handleDeleteItemInCart = (productId) => {
    dispatch(deleteCartItem({ userId: user?.id, productId })).then(
      (response) => {
        if (response.payload?.success) {
          toast(response?.payload?.message, {
            icon: "✅",
            duration: 2000,
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

  console.log(productList, "productList");
  const handleUpdateQuantity = (getCartItem, quantityChange) => {
    if (quantityChange == 1) {
      let indexOfCurrentItem = productList.findIndex(
        (item) => item._id === getCartItem?.productId
      );
      console.log(indexOfCurrentItem, "idx");

      if (indexOfCurrentItem > -1) {
        const totalStock = productList[indexOfCurrentItem].quantity;

        if (getCartItem.quantity + quantityChange > totalStock) {
          toast(
            `only ${getCartItem.quantity} quantity can be added for this item`,
            {
              icon: "❌",
              duration: 2000,
              position: "top-center",
              style: {
                backgroundColor: "black",
                color: "white",
              },
            }
          );
          return;
        }
      }
    }

    console.log("update quantity", getCartItem);
    dispatch(
      upadteCartItemQuantity({
        userId: user?.id,
        productId: getCartItem.productId,
        quantity: getCartItem.quantity + quantityChange,
      })
    ).then((response) => {
      if (response.payload?.success) {
        toast(response?.payload?.message, {
          icon: "✅",
          duration: 1000,
          position: "top-center",
          style: {
            backgroundColor: "black",
            color: "white",
          },
        });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 100, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 rounded bg-gray-800 border-gray-700"
    >
      <img
        src={cartItem.image}
        alt={cartItem.title}
        className="w-full sm:w-20 h-40 sm:h-20 object-cover object-top rounded"
      />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div className="flex-1 flex flex-col items-center sm:items-start">
          <h1 className="text-gray-200 font-bold text-lg text-center sm:text-left mb-2">
            {cartItem.title}
          </h1>
          <div className="flex items-center mt-1 border border-gray-600 rounded">
            <Button
              disabled={cartItem.quantity <= 1}
              onClick={() => handleUpdateQuantity(cartItem, -1)}
              className="bg-transparent text-gray-200 hover:text-orange-100 p-1 border-r border-gray-600 rounded-none hover:bg-transparent"
            >
              <Minus className="w-4 h-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span
              className={`px-1 font-bold ${
                mode === "dark" && "text-gray-200"
              } `}
            >
              {" "}
              {cartItem.quantity}
            </span>
            <Button
              onClick={() => handleUpdateQuantity(cartItem, 1)}
              className="bg-transparent text-gray-200 hover:text-orange-100 p-1 border-l border-gray-600 rounded-none hover:bg-transparent"
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <div>
            {cartItem && cartItem.size === "-" ? (
              ""
            ) : (
              <div className="mt-2 font-bold text-gray-200">Size : {cartItem.size}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center sm:items-end">
          <p className="text-green-200 font-bold text-lg mb-2">
            $
            {(cartItem.sellPrice > 0
              ? cartItem?.sellPrice * cartItem?.quantity
              : cartItem?.price * cartItem?.quantity
            ).toFixed(2)}
          </p>
          <Button
            onClick={() => handleDeleteItemInCart(cartItem?.productId)}
            className="bg-red-300 text-gray-700 hover:bg-red-200 p-1 rounded"
          >
            <Trash className="w-4 h-4" />
            <span className="block lg:hidden">Remove</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCartItemsContent;
