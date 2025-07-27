import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/orders-slice";
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Package, 
  CreditCard, 
  MapPin, 
  User, 
  Calendar,
  DollarSign,
  Phone,
  FileText,
  Truck,
  Ruler
} from "lucide-react";

const initialFormData = {
  status: "",
};

const AdminOrderDetails = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const { status } = formData;
    
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.success(data?.payload?.message || "Order status updated successfully");
      } else {
        toast.error(data?.payload?.message || "Failed to update order status");
      }
    }).catch((error) => {
      console.error("Update status error:", error);
      toast.error("An error occurred while updating order status");
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inshipping":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date format error:", error);
      return "Invalid Date";
    }
  };

  // Safe number conversion helper
  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Calculate order summary
  const orderSummary = React.useMemo(() => {
    if (!orderDetails?.cartItems?.length) {
      return {
        totalItems: 0,
        totalQuantity: 0,
        totalMeters: 0,
        hasShirting: false,
        hasRegular: false,
        calculatedTotal: 0
      };
    }

    let totalItems = orderDetails.cartItems.length;
    let totalQuantity = 0;
    let totalMeters = 0;
    let hasShirting = false;
    let hasRegular = false;
    let calculatedTotal = 0;

    orderDetails.cartItems.forEach(item => {
      if (item.category === 'men-shirting') {
        hasShirting = true;
        totalMeters += safeNumber(item.meters);
        calculatedTotal += safeNumber(item.totalCost);
      } else {
        hasRegular = true;
        totalQuantity += safeNumber(item.quantity);
        calculatedTotal += safeNumber(item.price) * safeNumber(item.quantity);
      }
    });

    return {
      totalItems,
      totalQuantity,
      totalMeters,
      hasShirting,
      hasRegular,
      calculatedTotal
    };
  }, [orderDetails?.cartItems]);

  if (!orderDetails) {
    return (
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-100">
        <div className="text-center py-8">
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 min-w-[60vw] max-w-5xl h-[90vh] max-h-[90vh] p-0 overflow-auto scrollbar-hide">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-700 p-4 sm:p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">Admin Order Details</h2>
            <Badge className={`${getStatusColor(orderDetails.orderStatus)} px-3 py-1 capitalize self-start sm:self-auto`}>
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

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Order Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400 text-xs sm:text-sm">Order Date</span>
                </div>
                <p className="text-white font-medium text-sm sm:text-base">{formatDate(orderDetails.orderDate)}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-xs sm:text-sm">Payment</span>
                </div>
                <p className="text-white font-medium text-sm sm:text-base">{orderDetails.paymentMethod || "N/A"}</p>
                <p className="text-xs text-gray-500">{orderDetails.paymentStatus || "Unknown"}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-xs sm:text-sm">Total Amount</span>
                </div>
                <p className="text-green-400 font-bold text-lg sm:text-xl">₹{safeNumber(orderDetails.totalAmount).toFixed(2)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Order Items ({orderSummary.totalItems})
              </h3>
              
              <div className="space-y-3">
                {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
                  orderDetails.cartItems.map((item, index) => {
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
                              <h4 className="font-medium text-white text-sm sm:text-base break-words min-w-0 flex-1">{item.title || "Unknown Item"}</h4>
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
                                    <span className="text-white">{safeNumber(item.meters)}m</span>
                                  </div>
                                  <div className="col-span-2 sm:col-span-1">
                                    <span className="block text-xs text-gray-500">Rate/meter</span>
                                    <span className="text-white">
                                      ₹{item.pricePerMeter ? safeNumber(item.pricePerMeter).toFixed(2) : 
                                        (item.totalCost && item.meters ? (safeNumber(item.totalCost) / safeNumber(item.meters)).toFixed(2) : "0.00")}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <span className="block text-xs text-gray-500">Quantity</span>
                                    <span className="text-white">{safeNumber(item.quantity)}</span>
                                  </div>
                                  <div>
                                    <span className="block text-xs text-gray-500">Price</span>
                                    <span className="text-white">₹{safeNumber(item.price).toFixed(2)}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right lg:text-right lg:ml-4 flex-shrink-0">
                            <div className="text-base sm:text-lg font-bold text-green-400">
                              ₹{isShirting 
                                ? safeNumber(item.totalCost).toFixed(2)
                                : (safeNumber(item.price) * safeNumber(item.quantity)).toFixed(2)
                              }
                            </div>
                            <div className="text-xs text-gray-400">
                              {isShirting ? 'Total cost' : `₹${safeNumber(item.price).toFixed(2)} × ${safeNumber(item.quantity)}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No items found in this order</p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Customer & Shipping Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Customer Information
                </h3>
                <div className="bg-gray-800 rounded-lg p-3 sm:p-4 space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs sm:text-sm">Customer Name</Label>
                    <p className="text-white font-medium text-sm sm:text-base break-words">{orderDetails.userName || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs sm:text-sm">Phone</Label>
                    <p className="text-white font-medium text-sm sm:text-base">{orderDetails.addressInfo?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs sm:text-sm">Payment ID</Label>
                    <p className="text-white font-medium font-mono text-xs sm:text-sm break-all">
                      {orderDetails.paymentId || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  Shipping Address
                </h3>
                <div className="bg-gray-800 rounded-lg p-3 sm:p-4 space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs sm:text-sm">Address</Label>
                    <p className="text-white font-medium text-sm sm:text-base break-words">{orderDetails.addressInfo?.address || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-gray-400 text-xs sm:text-sm">City</Label>
                      <p className="text-white font-medium text-sm sm:text-base">{orderDetails.addressInfo?.city || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs sm:text-sm">Pincode</Label>
                      <p className="text-white font-medium text-sm sm:text-base">{orderDetails.addressInfo?.pincode || "N/A"}</p>
                    </div>
                  </div>
                  {orderDetails.addressInfo?.notes && (
                    <div>
                      <Label className="text-gray-400 text-xs sm:text-sm">Notes</Label>
                      <p className="text-white font-medium text-sm sm:text-base break-words">{orderDetails.addressInfo.notes}</p>
                    </div>
                  )}
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
                  <div className="text-green-400 font-bold text-sm sm:text-base">₹{safeNumber(orderDetails.totalAmount).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Update Order Status */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-3 sm:p-4 border border-blue-700/30">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                Update Order Status
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                <CommonForm
                  formControls={[
                    {
                      label: "Order Status",
                      name: "status",
                      componentType: "select",
                      placeholder: "Select Order Status",
                      options: [
                        { id: "pending", label: "Pending" },
                        { id: "confirmed", label: "Confirmed" },
                        { id: "inShipping", label: "In Shipping" },
                        { id: "delivered", label: "Delivered" },
                        { id: "rejected", label: "Rejected" },
                      ],
                    },
                  ]}
                  formData={formData}
                  setFormData={setFormData}
                  ButtonText="Update Order Status"
                  onSubmit={handleUpdateStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetails;