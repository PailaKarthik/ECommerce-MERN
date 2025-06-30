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
} from "lucide-react";
import { Badge } from "../ui/badge";

const AdminOrdersList = () => {
  const [openOrderDetailsDialog, setOpenOrderDetailsDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState("pending");
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
      key: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "from-blue-600 to-cyan-600",
      statuses: ["confirmed"],
    },
    {
      key: "pending",
      label: "Pending",
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      hoverColor: "from-yellow-600 to-orange-600",
      statuses: ["pending", "inShipping", "inProcess"],
    },

    {
      key: "delivered",
      label: "Delivered",
      icon: Package,
      color: "from-green-500 to-emerald-500",
      hoverColor: "from-green-600 to-emerald-600",
      statuses: ["delivered", "rejected"],
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
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString) => {
    return dateString.split("T")[0].split("-").reverse().join(" / ");
  };

  const getFilteredOrders = () => {
    if (!orderList) return [];

    const currentFilter = filterButtons.find((f) => f.key === activeFilter);
    return orderList.filter((order) =>
      currentFilter.statuses.includes(order.orderStatus)
    );
  };

  const filteredOrders = getFilteredOrders();

  const getOrderCount = (filterKey) => {
    if (!orderList) return 0;
    const filter = filterButtons.find((f) => f.key === filterKey);
    return orderList.filter((order) =>
      filter.statuses.includes(order.orderStatus)
    ).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <Card className=" bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 border border-gray-700/50 shadow-2xl shadow-gray-900/50 backdrop-blur-sm">
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
                    relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 min-w-fit
                    ${
                      isActive
                        ? `bg-gradient-to-r ${filter.color} text-white shadow-lg transform scale-105`
                        : `bg-gray-700/50 text-gray-300 hover:bg-gradient-to-r hover:${filter.hoverColor} hover:text-white border border-gray-600/50`
                    }
                  `}
                  whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{filter.label}</span>
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
                      {count}
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
                      Order Date
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      Price
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
                            {order._id.slice(-8)}
                          </TableCell>
                          <TableCell className="text-gray-300 py-4">
                            {formatDate(order.orderDate)}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              className={`${getStatusColor(
                                order.orderStatus
                              )} capitalize font-medium border px-3 py-1 rounded-full`}
                            >
                              {order.orderStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-green-400 py-4">
                            ₹{order.totalAmount}.00
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
                        <div className="font-mono text-sm text-gray-200 break-all">
                          {order._id}
                        </div>
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          order.orderStatus
                        )} capitalize font-medium border px-2 py-1 rounded-full text-xs ml-2 flex-shrink-0`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-400">Date</div>
                          <div className="text-sm text-gray-200">
                            {formatDate(order.orderDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-400">Amount</div>
                          <div className="text-sm font-bold text-green-400">
                            ₹{order.totalAmount}.00
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
                      No {currentFilter.label} Orders
                    </h3>
                    <p className="text-gray-500 text-center">
                      {activeFilter === "pending" &&
                        "No pending or shipping orders at the moment."}
                      {activeFilter === "confirmed" &&
                        "No confirmed orders to display."}
                      {activeFilter === "delivered" &&
                        "No delivered or completed orders found."}
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
