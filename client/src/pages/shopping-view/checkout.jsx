import React, { useState } from "react";
import accImg from "../../assets/account.jpg";
import ShopAddress from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-content";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.shoppingOrders);

  console.log("current selected address", currentSelectedAddress);
  const totalCartAmount =
    cartItems &&
    cartItems.items &&
    cartItems.items.length > 0 &&
    cartItems.items.reduce(
      (acc, curr) =>
        acc +
        (curr.sellPrice > 0 ? curr.sellPrice : curr.price) * curr.quantity,
      0
    );

  console.log("cart Id", cartItems?._id);
  const handleInitiatePaypalPayment = () => {
    if (currentSelectedAddress === null) {
      toast("Please Select One Address to Proceed", {
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

    if (cartItems.length === 0) {
      toast("Your Cart is Empty", {
        icon: "🥲",
        duration: 2000,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.sellPrice > 0 ? item?.sellPrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "karthik");
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  };

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="bg-gray-900 grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 lg:p-5">
        <ShopAddress setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4 p-5 ">
          {cartItems &&
            cartItems.items &&
            cartItems.items.length > 0 &&
            cartItems.items.map((cartItem, index) => (
              <UserCartItemsContent
                key={index}
                cartItem={cartItem}
                mode="dark"
              />
            ))}
          <div className="mt-4 p-4 shadow-sm shadow-gray-500 rounded bg-gray-800">
            <div className="flex justify-between">
              <span className="font-bold text-lg text-gray-200">Total</span>
              <span className="font-bold text-green-400 text-lg">
                ₹{totalCartAmount || 0}.00
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full bg-gray-700 hover:bg-gray-600"
            >
              {isPaymentStart ? (
                "Processing Paypal Payment...."
              ) : (
                <div className="flex gap-1 items-center">
                  <IndianRupee />
                  Checkout with
                  <span className="text-blue-200 font-bold">Paypal </span>
                </div>
              )}
            </Button>
          </div>
          <div className="text-gray-500 text-center">
            <h3>Login With these Credentitials for Paypal testing</h3>
            <p>
              Email : <span>sb-ir343h43743406@personal.example.com</span>
            </p>
            <p>
              password : <span>vK=0KPuK</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
