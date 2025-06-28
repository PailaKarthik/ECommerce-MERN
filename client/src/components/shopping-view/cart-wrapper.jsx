import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import UserCartItemsContent from "./cart-content";
import { useNavigate } from "react-router";

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const navigate = useNavigate();
  const totalCartAmount =
    cartItems &&
    cartItems.items &&
    cartItems.items.length > 0 &&
    cartItems.items.reduce(
      (acc, curr) =>
        acc + (curr.sellPrice > 0 ? curr.sellPrice : curr.price) * curr.quantity,
      0
    );

    console.log(cartItems);
  return (
    <SheetContent className="sm:max-w-md bg-gray-900 text-gray-200 border-gray-700 max-h-screen flex flex-col">
      {/* Header / Title */}
      <SheetHeader className="flex-shrink-0">
        <SheetTitle className="text-gray-200 font-bold text-xl flex gap-1.5 items-center">
          <ShoppingCart />
          Your <span className="text-orange-300">cart</span>
        </SheetTitle>
      </SheetHeader>

      {/* Scrollable items area */}
      <div className="flex-grow mt-4 px-2 overflow-y-auto">
        {cartItems && cartItems.items && cartItems.items.length > 0 ? (
          <div className="space-y-4">
            {cartItems.items.map((item, index) => (
              <UserCartItemsContent key={index} cartItem={item} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center text-xl py-8">
            Cart is Empty
          </div>
        )}
      </div>

      {/* Footer: total and checkout button */}
      <div className="flex-shrink-0 px-2 py-4 border-t border-gray-700 bg-gray-900">
        <div className="flex justify-between mb-3">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-green-500 text-lg">
            ₹ {totalCartAmount || 0}.00
          </span>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full bg-gray-300 text-black font-bold text-md hover:bg-gray-200"
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
};

export default UserCartWrapper;
