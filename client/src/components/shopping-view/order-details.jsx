import React from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { Ruler, Package, Calendar, CreditCard, MapPin, User } from "lucide-react";

const ShoppingOrderDetails = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-400/30";
      case "inshipping":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate order summary
  const orderSummary = React.useMemo(() => {
    if (!orderDetails?.cartItems?.length) {
      return { totalItems: 0, totalQuantity: 0, totalMeters: 0, hasShirting: false, hasRegular: false };
    }

    let totalItems = orderDetails.cartItems.length;
    let totalQuantity = 0;
    let totalMeters = 0;
    let hasShirting = false;
    let hasRegular = false;

    orderDetails.cartItems.forEach(item => {
      if (item.category === 'men-shirting') {
        hasShirting = true;
        totalMeters += item.meters || 0;
      } else {
        hasRegular = true;
        totalQuantity += item.quantity || 0;
      }
    });

    return { totalItems, totalQuantity, totalMeters, hasShirting, hasRegular };
  }, [orderDetails?.cartItems]);

  return (
    <DialogContent className="bg-gray-900 border-gray-700 text-gray-100  md:min-w-[60vw] max-w-5xl h-[95vh] max-h-[95vh] p-0 overflow-auto scrollbar-hide">
      <div className="flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="border-b border-gray-700 p-4 sm:p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">Order Details</h2>
            <Badge className={`${getStatusColor(orderDetails.orderStatus)} px-3 py-1 self-start sm:self-auto`}>
              {orderDetails.orderStatus}
            </Badge>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm font-mono break-all">#{orderDetails._id}</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-400">
            <span>{orderSummary.totalItems} items</span>
            {orderSummary.hasRegular && <span>• {orderSummary.totalQuantity} pieces</span>}
            {orderSummary.hasShirting && <span>• {orderSummary.totalMeters}m fabric</span>}
          </div>
        </div>

        {/* Content - Scrollable with custom scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Order Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-400 text-xs sm:text-sm">Order Date</span>
                </div>
                <p className="text-white font-medium text-sm sm:text-base">{formatDate(orderDetails.orderDate)}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-400 text-xs sm:text-sm">Payment</span>
                </div>
                <p className="text-white font-medium text-sm sm:text-base">{orderDetails.paymentMethod}</p>
                <p className="text-xs text-gray-500">{orderDetails.paymentStatus}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400">₹</span>
                  <span className="text-gray-400 text-xs sm:text-sm">Total Amount</span>
                </div>
                <p className="text-green-400 font-bold text-lg sm:text-xl">₹{orderDetails.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                Order Items
              </h3>
              
              <div className="space-y-3">
                {orderDetails.cartItems?.map((item, index) => {
                  const isShirting = item.category === 'men-shirting';
                  
                  return (
                    <div key={index} className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {isShirting ? (
                              <Ruler className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            ) : (
                              <Package className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            )}
                            <h4 className="font-medium text-white text-sm sm:text-base break-words min-w-0 flex-1">{item.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${isShirting ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {isShirting ? 'Fabric' : 'Ready-made'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs sm:text-sm text-gray-400">
                            {/* Size (only for non-shirting) */}
                            {!isShirting && item.size && item.size !== "-" && (
                              <div>
                                <span className="block text-xs text-gray-500">Size</span>
                                <span className="text-white">{item.size}</span>
                              </div>
                            )}
                            
                            {/* Quantity or Meters */}
                            {isShirting ? (
                              <>
                                <div>
                                  <span className="block text-xs text-gray-500">Meters</span>
                                  <span className="text-white">{item.meters}m</span>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                  <span className="block text-xs text-gray-500">Rate/meter</span>
                                  <span className="text-white">₹{item.pricePerMeter || (item.totalCost / item.meters).toFixed(2)}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <span className="block text-xs text-gray-500">Quantity</span>
                                  <span className="text-white">{item.quantity}</span>
                                </div>
                                <div>
                                  <span className="block text-xs text-gray-500">Price</span>
                                  <span className="text-white">₹{item.price}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right lg:text-right lg:ml-4 flex-shrink-0">
                          <div className="text-base sm:text-lg font-bold text-green-400">
                            ₹{isShirting ? item.totalCost.toFixed(2) : (item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {isShirting ? 'Total cost' : `₹${item.price} × ${item.quantity}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Shipping Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                Shipping Information
              </h3>
              
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Customer Name
                      </Label>
                      <p className="text-white font-medium text-sm sm:text-base break-words">{orderDetails.userName || user?.username}</p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-400 text-xs sm:text-sm">Phone</Label>
                      <p className="text-white font-medium text-sm sm:text-base">{orderDetails.addressInfo.phone}</p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-400 text-xs sm:text-sm">City</Label>
                      <p className="text-white font-medium text-sm sm:text-base">{orderDetails.addressInfo.city}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-xs sm:text-sm">Address</Label>
                      <p className="text-white font-medium text-sm sm:text-base break-words">{orderDetails.addressInfo.address}</p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-400 text-xs sm:text-sm">Pincode</Label>
                      <p className="text-white font-medium text-sm sm:text-base">{orderDetails.addressInfo.pincode}</p>
                    </div>
                    
                    {orderDetails.addressInfo.notes && (
                      <div>
                        <Label className="text-gray-400 text-xs sm:text-sm">Notes</Label>
                        <p className="text-white font-medium text-sm sm:text-base break-words">{orderDetails.addressInfo.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600">
              <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Order Summary</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="text-center">
                  <div className="text-gray-400">Total Items</div>
                  <div className="text-white font-bold text-sm sm:text-base">{orderSummary.totalItems}</div>
                </div>
                
                {orderSummary.hasRegular && (
                  <div className="text-center">
                    <div className="text-gray-400">Pieces</div>
                    <div className="text-blue-400 font-bold text-sm sm:text-base">{orderSummary.totalQuantity}</div>
                  </div>
                )}
                
                {orderSummary.hasShirting && (
                  <div className="text-center">
                    <div className="text-gray-400">Fabric</div>
                    <div className="text-orange-400 font-bold text-sm sm:text-base">{orderSummary.totalMeters}m</div>
                  </div>
                )}
                
                <div className={`text-center ${!orderSummary.hasRegular && !orderSummary.hasShirting ? 'col-span-1' : orderSummary.hasRegular && orderSummary.hasShirting ? 'col-span-2 lg:col-span-1' : 'col-span-1'}`}>
                  <div className="text-gray-400">Total Amount</div>
                  <div className="text-green-400 font-bold text-sm sm:text-base">₹{orderDetails.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShoppingOrderDetails;