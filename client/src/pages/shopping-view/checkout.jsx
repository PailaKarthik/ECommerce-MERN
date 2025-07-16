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
  const { isLoading } = useSelector((state) => state.shoppingOrders);

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
    const payload = await dispatch(
      createNewOrder({
        userId: user?.id,
        cartId: cartItems?._id,
        cartItems: cartItems.items.map((item) => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          price: item.sellPrice > 0 ? item.sellPrice : item.price,
          quantity: item.quantity,
          size: item.size,
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

    console.log(payload);
    // 2) configure and open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: payload.amount, // paise
      currency: payload.currency, // "INR"
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Responsive Height */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Checkout"
        />
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 min-h-screen">
        <div className="px-4 sm:px-6 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4">
            
            {/* Address Section - Full width on mobile, left column on desktop */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                  Delivery Address
                </h2>
                <ShopAddress setCurrentSelectedAddress={setCurrentSelectedAddress} />
              </div>
            </div>

            {/* Order Summary Section - Full width on mobile, right column on desktop */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg sticky top-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                  Order Summary
                </h2>
                
                {/* Cart Items */}
                <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto">
                  {cartItems?.items?.length > 0 ? (
                    cartItems.items.map((cartItem, i) => (
                      <div key={i} className="border-b border-gray-700 pb-3 last:border-b-0">
                        <UserCartItemsContent
                          cartItem={cartItem}
                          mode="dark"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>Your cart is empty</p>
                    </div>
                  )}
                </div>

                {/* Total Section */}
                {cartItems?.items?.length > 0 && (
                  <>
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <div className="space-y-2 text-sm sm:text-base">
                        <div className="flex justify-between text-gray-300">
                          <span>Subtotal</span>
                          <span>₹{totalCartAmount}.00</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Shipping</span>
                          <span className="text-green-400">Free</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Tax</span>
                          <span>Included</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-lg sm:text-xl font-bold text-white">Total</span>
                          <span className="text-lg sm:text-xl font-bold text-green-400">
                            ₹{totalCartAmount}.00
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-6">
                      <Button
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        disabled={isLoading || !cartItems?.items?.length}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <IndianRupee className="h-5 w-5" />
                            <span>Checkout with Razorpay</span>
                          </div>
                        )}
                      </Button>
                      
                      {/* Security Info */}
                      <div className="mt-3 text-center">
                        <p className="text-xs sm:text-sm text-gray-400">
                          🔒 Secure payment powered by Razorpay
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;