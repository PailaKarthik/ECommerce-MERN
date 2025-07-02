import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import AdminOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/orders-slice";
import { motion } from "framer-motion";
import {
  SquareArrowOutUpRight,
  Calendar,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Badge } from "../ui/badge";

const AdminOrdersList = () => {
  const [openOrderDetailsDialog, setOpenOrderDetailsDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState("requests");
  const { orderList, orderDetails } = useSelector((state) => state.adminOrders);
  const dispatch = useDispatch();

  const handleFetchOrderDetails = (id) => {
    dispatch(getOrderDetailsForAdmin(id));
  };

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenOrderDetailsDialog(true);
    }
  }, [orderDetails]);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const filterButtons = [
    {
      key: "requests",
      label: "Requests",
      icon: FileText,
      color: "from-orange-500 to-red-500",
      hoverColor: "from-orange-600 to-red-600",
      statuses: ["CONFIRMED", "CONFIRMED"], // All statuses except inShipping, rejected, delivered
      description: "New orders requiring attention"
    },
    {
      key: "shipping",
      label: "Shipping",
      icon: Truck,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "from-blue-600 to-cyan-600",
      statuses: ["inShipping"],
      description: "Orders currently in transit"
    },
    {
      key: "responded",
      label: "Responded",
      icon: MessageSquare,
      color: "from-green-500 to-emerald-500",
      hoverColor: "from-green-600 to-emerald-600",
      statuses: ["rejected", "delivered"],
      description: "Completed or rejected orders"
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inShipping":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredOrders = () => {
    if (!orderList || !Array.isArray(orderList)) return [];

    const currentFilter = filterButtons.find((f) => f.key === activeFilter);
    const filtered = orderList.filter((order) =>
      currentFilter.statuses.includes(order.orderStatus)
    );

    // Sort by date - newest first
    return filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  const filteredOrders = getFilteredOrders();

  const getOrderCount = (filterKey) => {
    if (!orderList || !Array.isArray(orderList)) return 0;
    const filter = filterButtons.find((f) => f.key === filterKey);
    return orderList.filter((order) =>
      filter.statuses.includes(order.orderStatus)
    ).length;
  };

  const getStatusDisplayName = (status) => {
    const statusMap = {
      pending: "Pending",
      confirmed: "Confirmed",
      inShipping: "In Shipping",
      delivered: "Delivered",
      rejected: "Rejected"
    };
    return statusMap[status] || status;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 border border-gray-700/50 shadow-2xl shadow-gray-900/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2 mb-6">
            <Package className="w-6 h-6 text-blue-400" />
            Orders Management
          </CardTitle>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {filterButtons.map((filter) => {
              const IconComponent = filter.icon;
              const isActive = activeFilter === filter.key;
              const count = getOrderCount(filter.key);

              return (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`
                    relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex flex-col items-center gap-1 min-w-[120px]
                    ${
                      isActive
                        ? `bg-gradient-to-r ${filter.color} text-white shadow-lg transform scale-105`
                        : `bg-gray-700/50 text-gray-300 hover:bg-gradient-to-r hover:${filter.hoverColor} hover:text-white border border-gray-600/50`
                    }
                  `}
                  whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={filter.description}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </div>
                  {count > 0 && (
                    <span
                      className={`
                      px-2 py-0.5 rounded-full text-xs font-bold
                      ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-600 text-gray-200"
                      }
                    `}
                    >
                      {count} orders
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <Table className="w-full">
                <TableHeader className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
                  <TableRow>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      Order ID
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      Order Date & Time
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0
                    ? filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300"
                        >
                          <TableCell className="font-mono text-sm text-gray-300 py-4">
                            #{order._id.slice(-8).toUpperCase()}
                          </TableCell>
                          <TableCell className="text-gray-300 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium">{formatDate(order.orderDate)}</span>
                              <span className="text-xs text-gray-400">{formatDateTime(order.orderDate).split(',')[1]}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              className={`${getStatusColor(
                                order.orderStatus
                              )} capitalize font-medium border px-3 py-1 rounded-full`}
                            >
                              {getStatusDisplayName(order.orderStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-green-400 py-4">
                            ₹{order.totalAmount.toLocaleString('en-IN')}{order.totalAmount % 1 === 0 ? '.00' : ''}
                          </TableCell>
                          <TableCell className="py-4">
                            <Dialog
                              open={openOrderDetailsDialog}
                              onOpenChange={() => {
                                setOpenOrderDetailsDialog(false);
                                dispatch(resetOrderDetails());
                              }}
                            >
                              <Button
                                onClick={() =>
                                  handleFetchOrderDetails(order._id)
                                }
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                              >
                                View Details
                                <SquareArrowOutUpRight className="w-4 h-4" />
                              </Button>
                              {orderDetails && (
                                <AdminOrderDetails
                                  orderDetails={orderDetails}
                                />
                              )}
                            </Dialog>
                          </TableCell>
                        </motion.tr>
                      ))
                    : null}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-4 pb-4">
            {filteredOrders.length > 0
              ? filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="mb-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">
                          Order ID
                        </div>
                        <div className="font-mono text-sm text-gray-200">
                          #{order._id.slice(-8).toUpperCase()}
                        </div>
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          order.orderStatus
                        )} capitalize font-medium border px-2 py-1 rounded-full text-xs ml-2 flex-shrink-0`}
                      >
                        {getStatusDisplayName(order.orderStatus)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-400">Date & Time</div>
                          <div className="text-sm text-gray-200">
                            {formatDateTime(order.orderDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-400">Amount</div>
                          <div className="text-sm font-bold text-green-400">
                            ₹{order.totalAmount.toLocaleString('en-IN')}{order.totalAmount % 1 === 0 ? '.00' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Dialog
                      open={openOrderDetailsDialog}
                      onOpenChange={() => {
                        setOpenOrderDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(order._id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        View Details
                        <SquareArrowOutUpRight className="w-4 h-4" />
                      </Button>
                      {orderDetails && (
                        <AdminOrderDetails orderDetails={orderDetails} />
                      )}
                    </Dialog>
                  </motion.div>
                ))
              : null}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              {(() => {
                const currentFilter = filterButtons.find(
                  (f) => f.key === activeFilter
                );
                const IconComponent = currentFilter.icon;
                return (
                  <>
                    <IconComponent className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">
                      No {currentFilter.label}
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {activeFilter === "requests" &&
                        "No pending requests at the moment. New orders will appear here when they need your attention."}
                      {activeFilter === "shipping" &&
                        "No orders currently in shipping. Orders marked as 'In Shipping' will appear here."}
                      {activeFilter === "responded" &&
                        "No completed orders to display. Delivered and rejected orders will appear here."}
                    </p>
                  </>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminOrdersList;