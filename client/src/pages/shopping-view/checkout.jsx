import React, { useState } from "react";
import accImg from "../../assets/account.jpg";
import ShopAddress from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-content";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { toast } from "sonner";

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const {  isLoading } = useSelector(
    (state) => state.shoppingOrders
  );

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();

  const totalCartAmount =
    cartItems?.items?.reduce(
      (acc, curr) =>
        acc +
        (curr.sellPrice > 0 ? curr.sellPrice : curr.price) * curr.quantity,
      0
    ) || 0;

  const handlePayment = async () => {
    if (!currentSelectedAddress) {
      return toast("Please select an address", { icon: "❌" });
    }
    if (!cartItems?.items?.length) {
      return toast("Your cart is empty", { icon: "🥲" });
    }

    // 1) create order on backend
    const payload  = await dispatch(
      createNewOrder({
        userId: user?.id,
        cartId: cartItems?._id,
        cartItems: cartItems.items.map((item) => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          price: item.sellPrice > 0 ? item.sellPrice : item.price,
          quantity: item.quantity,
          size : item.size
        })),
        addressInfo: {
          addressId: currentSelectedAddress._id,
          address: currentSelectedAddress.address,
          city: currentSelectedAddress.city,
          pincode: currentSelectedAddress.pincode,
          phone: currentSelectedAddress.phone,
          notes: currentSelectedAddress.notes,
        },
        totalAmount: totalCartAmount,
      })
    ).unwrap();
    
    console.log(payload)
    // 2) configure and open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: payload.amount,         // paise
      currency: payload.currency,     // “INR”
      order_id: payload.razorpayOrderId,
      handler: async (resp) => {
        // 3) capture on backend
        await dispatch(
          capturePayment({
            orderId: payload.orderId,
            razorpayPaymentId: resp.razorpay_payment_id,
            razorpaySignature: resp.razorpay_signature,
            razorpayOrderId: resp.razorpay_order_id,
          })
        ).unwrap();
        // 4) navigate to a confirmation page:
        window.location.href = `/shop/razorpay-success`;
      },
      modal: {
        ondismiss: () => toast("Payment cancelled", { icon: "⚠️" }),
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
    };
    new window.Razorpay(options).open();
  };

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
          {cartItems?.items?.map((cartItem, i) => (
            <UserCartItemsContent
              key={i}
              cartItem={cartItem}
              mode="dark"
            />
          ))}
          <div className="mt-4 p-4 shadow-sm shadow-gray-500 rounded bg-gray-800">
            <div className="flex justify-between">
              <span className="font-bold text-lg text-gray-200">Total</span>
              <span className="font-bold text-green-400 text-lg">
                ₹{totalCartAmount}.00
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={handlePayment}
              className="w-full bg-gray-700 hover:bg-gray-600"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing…"
                : (
                  <div className="flex items-center gap-2">
                    <IndianRupee /> Checkout with Razorpay
                  </div>
                )
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
