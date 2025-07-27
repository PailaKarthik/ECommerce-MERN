import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { ShoppingCart, Shield, CreditCard } from "lucide-react";
import UserCartItemsContent from "./cart-content";
import { useNavigate } from "react-router";

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const navigate = useNavigate();
  
  // Enhanced total calculation that handles both regular products and shirting products
  const totalCartAmount = React.useMemo(() => {
    if (!cartItems?.items?.length) return 0;
    
    return cartItems.items.reduce((acc, curr) => {
      // For shirting products, use totalCost if available
      if (curr.category === 'men-shirting' && curr.totalCost) {
        return acc + curr.totalCost;
      }
      
      // For regular products, calculate based on price and quantity
      const itemPrice = curr.sellPrice > 0 ? curr.sellPrice : curr.price;
      return acc + (itemPrice * curr.quantity);
    }, 0);
  }, [cartItems?.items]);

  const itemCount = cartItems?.items?.length || 0;

  // Calculate item breakdown for debugging
  const itemBreakdown = React.useMemo(() => {
    if (!cartItems?.items?.length) return [];
    
    return cartItems.items.map(item => {
      const isShirting = item.category === 'men-shirting';
      
      if (isShirting && item.totalCost) {
        return {
          title: item.title,
          type: 'shirting',
          quantity: `${item.meters}m`,
          unitPrice: item.totalCost / item.meters,
          total: item.totalCost
        };
      }
      
      return {
        title: item.title,
        type: 'regular',
        quantity: item.quantity,
        unitPrice: item.sellPrice > 0 ? item.sellPrice : item.price,
        total: (item.sellPrice > 0 ? item.sellPrice : item.price) * item.quantity
      };
    });
  }, [cartItems?.items]);

  console.log("Cart Items:", cartItems);
  console.log("Item Breakdown:", itemBreakdown);
  console.log("Total Cart Amount:", totalCartAmount);
  
  return (
    <SheetContent className="sm:max-w-lg bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 border-gray-700 max-h-screen flex flex-col shadow-2xl">
      {/* Header / Title */}
      <SheetHeader className="flex-shrink-0 pb-4 border-b border-gray-700">
        <SheetTitle className="text-gray-100 font-bold text-xl lg:text-2xl flex gap-2 items-center">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <ShoppingCart className="text-orange-400" size={24} />
          </div>
          <div className="flex flex-col">
            <span>Your <span className="text-orange-400">Cart</span></span>
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-400">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </SheetTitle>
      </SheetHeader>

      {/* Scrollable items area */}
      <div className="flex-grow mt-4 px-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {cartItems && cartItems.items && cartItems.items.length > 0 ? (
          <div className="space-y-3">
            {cartItems.items.map((item, index) => (
              <UserCartItemsContent key={item.productId || index} cartItem={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="p-6 bg-gray-800/50 rounded-full mb-4">
              <ShoppingCart className="text-gray-500" size={48} />
            </div>
            <h3 className="text-gray-400 text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-sm">Add some items to get started!</p>
          </div>
        )}
      </div>

      {/* Footer: total and checkout section */}
      {cartItems && cartItems.items && cartItems.items.length > 0 && (
        <div className="flex-shrink-0 px-2 py-2 md:py-4 border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
          {/* Item Breakdown - Development mode only */}
          {import.meta.env.NODE_ENV === 'development' && (
            <div className="mb-2 p-2 bg-gray-800/30 rounded text-xs">
              <details>
                <summary className="text-gray-400 cursor-pointer">Debug: Item Breakdown</summary>
                <div className="mt-1 space-y-1">
                  {itemBreakdown.map((item, index) => (
                    <div key={index} className="text-gray-300">
                      {item.title}: {item.quantity} × ₹{item.unitPrice.toFixed(2)} = ₹{item.total.toFixed(2)} ({item.type})
                    </div>
                  ))}
                  <div className="font-bold text-green-400 pt-1 border-t border-gray-600">
                    Total: ₹{totalCartAmount.toFixed(2)}
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* Subtotal */}
          <div className="flex justify-between items-center mb-2 md:mb-4 p-1 md:p-3 bg-gray-800/50 rounded-lg">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Subtotal</span>
              <span className="font-bold text-lg lg:text-xl text-gray-100">
                ₹{totalCartAmount ? totalCartAmount.toFixed(2) : "0.00"}
              </span>
              {/* Show item count breakdown */}
              <span className="text-gray-500 text-xs mt-1">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-400 text-sm mb-1">
                <Shield size={14} />
                <span>Secure checkout</span>
              </div>
              <span className="text-gray-500 text-xs">Tax included</span>
            </div>
          </div>

          {/* Price breakdown for mixed cart */}
          {itemBreakdown.some(item => item.type === 'shirting') && itemBreakdown.some(item => item.type === 'regular') && (
            <div className="mb-2 p-2 bg-gray-800/30 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Order includes:</div>
              <div className="space-y-1 text-xs">
                {itemBreakdown.filter(item => item.type === 'regular').length > 0 && (
                  <div className="text-gray-300">
                    • {itemBreakdown.filter(item => item.type === 'regular').length} regular item(s)
                  </div>
                )}
                {itemBreakdown.filter(item => item.type === 'shirting').length > 0 && (
                  <div className="text-gray-300">
                    • {itemBreakdown.filter(item => item.type === 'shirting').reduce((acc, item) => acc + parseFloat(item.quantity), 0)}m fabric item(s)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base lg:text-lg py-2 lg:py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <CreditCard className="mr-2" size={20} />
            Proceed to Checkout
          </Button>

          {/* Payment Methods */}
          <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-700">
            <p className="text-center text-gray-400 text-xs mb-2 md:mb-3">We accept</p>
            <div className="flex justify-center items-center gap-3 flex-wrap">
              {/* Visa */}
              <div className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold">
                VISA
              </div>
              {/* Mastercard */}
              <div className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1">
                <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-300 rounded-full -ml-1"></div>
              </div>
              {/* RuPay */}
              <div className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold">
                RuPay
              </div>
              {/* UPI */}
              <div className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-bold">
                UPI
              </div>
              {/* Phonepe */}
              <div className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold">
                Phonepe
              </div>
              {/* GPay */}
              <div className="bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-bold border border-gray-600">
                GPay
              </div>
            </div>
            <div className="flex justify-center items-center mt-2 text-gray-500 text-xs">
              <Shield size={12} className="mr-1" />
              <span>256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      )}
    </SheetContent>
  );
};

export default UserCartWrapper;