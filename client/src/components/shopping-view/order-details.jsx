import React from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const ShoppingOrderDetails = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: { 
        color: "bg-blue-500/20 text-blue-400 border-blue-400/30",
        icon: "✓"
      },
      rejected: { 
        color: "bg-red-500/20 text-red-400 border-red-400/30",
        icon: "✗"
      },
      delivered: { 
        color: "bg-green-500/20 text-green-400 border-green-400/30",
        icon: "✓"
      },
      inShipping: { 
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
        icon: "🚚"
      },
      pending: { 
        color: "bg-gray-500/20 text-gray-400 border-gray-400/30",
        icon: "⏳"
      }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(orderDetails.orderStatus);

  return (
    <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 p-0 max-w-[95vw] sm:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[65vw] max-h-[95vh] overflow-auto scrollbar-hide">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 sm:p-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Order Details</h2>
              <p className="text-gray-400 text-sm">#{orderDetails._id}</p>
            </div>
            <Badge className={`${statusConfig.color} border px-3 py-1.5 text-sm font-medium self-start sm:self-center`}>
              <span className="mr-2">{statusConfig.icon}</span>
              {orderDetails.orderStatus.charAt(0).toUpperCase() + orderDetails.orderStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Order Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Order Date</p>
                    <p className="font-semibold text-white">
                      {orderDetails.orderDate
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join(" / ")}
                    </p>
                  </div>
                  <div className="text-2xl">📅</div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="font-bold text-green-400 text-lg">
                      ₹{orderDetails.totalAmount}.00
                    </p>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Payment</p>
                    <p className="font-semibold text-white">{orderDetails.paymentMethod}</p>
                    <p className="text-xs text-gray-500">{orderDetails.paymentStatus}</p>
                  </div>
                  <div className="text-2xl">💳</div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-xl">📦</span>
                Order Items
              </h3>
              
              <div className="space-y-3">
                {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
                  orderDetails.cartItems.map((product, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{product.title}</h4>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                              Size: {product.size}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                              Qty: {product.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">₹{product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No items found</p>
                )}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Shipping Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-xl">🚚</span>
                Shipping Information
              </h3>
              
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-sm">Name</Label>
                      <p className="font-medium text-white">{user.username}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Phone</Label>
                      <p className="font-medium text-white">{orderDetails.addressInfo.phone}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">City</Label>
                      <p className="font-medium text-white">{orderDetails.addressInfo.city}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-sm">Address</Label>
                      <p className="font-medium text-white">{orderDetails.addressInfo.address}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Pincode</Label>
                      <p className="font-medium text-white">{orderDetails.addressInfo.pincode}</p>
                    </div>
                    {orderDetails.addressInfo.notes && (
                      <div>
                        <Label className="text-gray-400 text-sm">Notes</Label>
                        <p className="font-medium text-white">{orderDetails.addressInfo.notes}</p>
                      </div>
                    )}
                  </div>
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