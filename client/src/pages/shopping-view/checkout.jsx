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

  // Calculate total cart amount with proper handling for shirting products
  const totalCartAmount = React.useMemo(() => {
    if (!cartItems?.items?.length) return 0;
    
    return cartItems.items.reduce((acc, curr) => {
      // For shirting products, use totalCost if available
      if (curr.category === 'men-shirting' && curr.totalCost) {
        return acc + curr.totalCost;
      }
      
      // For regular products, use the existing logic
      const itemPrice = curr.sellPrice > 0 ? curr.sellPrice : curr.price;
      return acc + (itemPrice * curr.quantity);
    }, 0);
  }, [cartItems?.items]);

  // Calculate item breakdown for display
  const getItemBreakdown = () => {
    return cartItems?.items?.map(item => {
      const isShirting = item.category === 'men-shirting';
      
      if (isShirting && item.totalCost) {
        return {
          ...item,
          displayPrice: item.totalCost,
          displayQuantity: `${item.meters}m`,
          unitPrice: item.totalCost / item.meters,
        };
      }
      
      return {
        ...item,
        displayPrice: (item.sellPrice > 0 ? item.sellPrice : item.price) * item.quantity,
        displayQuantity: item.quantity,
        unitPrice: item.sellPrice > 0 ? item.sellPrice : item.price,
      };
    }) || [];
  };

  const itemBreakdown = getItemBreakdown();

  const handlePayment = async () => {
    if (!currentSelectedAddress) {
      return toast("Please select an address", { icon: "❌" });
    }
    if (!cartItems?.items?.length) {
      return toast("Your cart is empty", { icon: "🥲" });
    }

    // Prepare cart items with proper structure for both product types
    const orderCartItems = cartItems.items.map((item) => {
      const baseItem = {
        productId: item.productId,
        title: item.title,
        image: item.images?.[0] || item.image || "", // Handle images array
        price: item.sellPrice > 0 ? item.sellPrice : item.price,
        quantity: item.quantity,
        size: item.size || "-",
        category: item.category,
      };

      // Add shirting-specific fields if applicable
      if (item.category === 'men-shirting') {
        baseItem.totalCost = item.totalCost;
        baseItem.meters = item.meters;
        baseItem.pricePerMeter = item.totalCost / item.meters; // Calculate per meter price
      }

      return baseItem;
    });

    try {
      // 1) Create order on backend
      const payload = await dispatch(
        createNewOrder({
          userId: user?.id,
          cartId: cartItems?._id,
          cartItems: orderCartItems,
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

      console.log("Order payload:", payload);

      // 2) Configure and open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: payload.amount, // paise
        currency: payload.currency, // "INR"
        order_id: payload.razorpayOrderId,
        name: "Your Store Name",
        description: "Purchase from your store",
        handler: async (resp) => {
          try {
            // 3) Capture payment on backend
            await dispatch(
              capturePayment({
                orderId: payload.orderId,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
                razorpayOrderId: resp.razorpay_order_id,
              })
            ).unwrap();
            
            // 4) Navigate to confirmation page
            window.location.href = `/shop/razorpay-success`;
          } catch (error) {
            console.error("Payment capture failed:", error);
            toast("Payment verification failed. Please contact support.", { 
              icon: "❌",
              duration: 5000 
            });
          }
        },
        modal: {
          ondismiss: () => toast("Payment cancelled", { icon: "⚠️" }),
        },
        prefill: {
          name: user.username || user.name,
          email: user.email,
        },
        theme: {
          color: "#3B82F6", // Blue theme to match your site
        },
      };
      
      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Order creation failed:", error);
      toast("Failed to create order. Please try again.", { 
        icon: "❌",
        duration: 5000 
      });
    }
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
                          mode="checkout" // Pass checkout mode to disable editing
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>Your cart is empty</p>
                    </div>
                  )}
                </div>

                {/* Detailed Item Breakdown */}
                {cartItems?.items?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Order Details</h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      {itemBreakdown.map((item, index) => (
                        <div key={index} className="flex justify-between text-gray-400">
                          <span className="truncate mr-2">
                            {item.title} 
                            {item.category === 'men-shirting' ? 
                              ` (${item.displayQuantity})` : 
                              ` (${item.displayQuantity} × ₹${item.unitPrice})`
                            }
                            {item.size && item.size !== "-" && ` - ${item.size}`}
                          </span>
                          <span className="flex-shrink-0">₹{item.displayPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Section */}
                {cartItems?.items?.length > 0 && (
                  <>
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <div className="space-y-2 text-sm sm:text-base">
                        <div className="flex justify-between text-gray-300">
                          <span>Subtotal</span>
                          <span>₹{totalCartAmount.toFixed(2)}</span>
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
                            ₹{totalCartAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-6">
                      <Button
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        disabled={isLoading || !cartItems?.items?.length || !currentSelectedAddress}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <IndianRupee className="h-5 w-5" />
                            <span>Pay ₹{totalCartAmount.toFixed(2)}</span>
                          </div>
                        )}
                      </Button>
                      
                      {/* Validation Messages */}
                      {!currentSelectedAddress && (
                        <p className="mt-2 text-xs text-orange-400 text-center">
                          Please select a delivery address to continue
                        </p>
                      )}
                      
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