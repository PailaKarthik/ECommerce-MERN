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
import { SquareArrowOutUpRight, Filter, Search, Calendar } from "lucide-react";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUser,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

const ShoppingOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector(
    (state) => state.shoppingOrders
  );

  const [openOrderDetailsDialog, setOpenOrderDetailsDailog] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(getAllOrdersByUser(user?.id));
  }, [dispatch, user]);

  const handleFetchOrderDetails = (id) => {
    dispatch(getOrderDetails(id));
  };

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenOrderDetailsDailog(true);
    }
  }, [orderDetails]);

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    if (!orderList || orderList.length === 0) return [];

    let filtered = [...orderList];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.orderStatus === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      
      if (sortBy === "newest") {
        return dateB - dateA; // Most recent first
      } else if (sortBy === "oldest") {
        return dateA - dateB; // Oldest first
      } else if (sortBy === "amount-high") {
        return b.totalAmount - a.totalAmount;
      } else if (sortBy === "amount-low") {
        return a.totalAmount - b.totalAmount;
      }
      return 0;
    });

    return filtered;
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-900/30 text-blue-300 border-blue-700/50";
      case "rejected":
        return "bg-red-900/30 text-red-300 border-red-700/50";
      case "delivered":
        return "bg-green-900/30 text-green-300 border-green-700/50";
      case "inShipping":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-700/50";
      case "pending":
        return "bg-orange-900/30 text-orange-300 border-orange-700/50";
      default:
        return "bg-gray-700/50 text-gray-300 border-gray-600/50";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const statusOptions = [
    { value: "all", label: "All Orders", count: orderList?.length || 0 },
    { value: "delivered", label: "Delivered", count: orderList?.filter(o => o.orderStatus === "delivered").length || 0 },
    { value: "rejected", label: "Rejected", count: orderList?.filter(o => o.orderStatus === "rejected").length || 0 },
  ];

  const filteredOrders = getFilteredAndSortedOrders();

  return (
    <div className="min-h-screen bg-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto space-y-6"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 rounded-2xl p-6 text-white border border-gray-700 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Order History
              </h1>
              <p className="text-gray-300">Track and manage all your orders in one place</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-800 rounded-xl p-2 md:p-4 shadow-lg border border-gray-700"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status.value}
                  variant={filterStatus === status.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status.value)}
                  className={`${
                    filterStatus === status.value
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                  } transition-all duration-200`}
                >
                  {status.label}
                  <Badge 
                    variant="secondary" 
                    className="ml-1 text-xs bg-gray-600 text-gray-200 border-gray-500"
                  >
                    {status.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders Table/Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-gray-800 shadow-xl border border-gray-700 rounded-xl overflow-hidden">
            <CardContent className="p-0">
              {filteredOrders && filteredOrders.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                    <Table>
                      <TableHeader className="bg-gray-750">
                        <TableRow className="border-gray-600">
                          <TableHead className="text-gray-200 font-semibold py-4">Order ID</TableHead>
                          <TableHead className="text-gray-200 font-semibold">Date</TableHead>
                          <TableHead className="text-gray-200 font-semibold">Status</TableHead>
                          <TableHead className="text-gray-200 font-semibold">Amount</TableHead>
                          <TableHead className="text-gray-200 font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order, index) => (
                          <motion.tr
                            key={order._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="border-gray-700 hover:bg-gray-750/50 transition-colors duration-200"
                          >
                            <TableCell className="font-mono text-sm py-4 text-gray-300">
                              #{order._id.slice(-8).toUpperCase()}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {formatDate(order.orderDate)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getOrderStatusColor(order.orderStatus)} border font-medium`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-lg text-gray-200">
                              ₹{order.totalAmount.toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleFetchOrderDetails(order._id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                size="sm"
                              >
                                View Details
                                <SquareArrowOutUpRight className="ml-2 w-4 h-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-2 p-2">
                    {filteredOrders.map((order, index) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="bg-gray-750 border border-gray-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-500"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-mono text-sm text-gray-300">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {formatDate(order.orderDate)}
                            </p>
                          </div>
                          <Badge className={`${getOrderStatusColor(order.orderStatus)} border font-medium`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-200">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                          <Button
                            onClick={() => handleFetchOrderDetails(order._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            size="sm"
                          >
                            View Details
                            <SquareArrowOutUpRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto w-16 h-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Orders Found</h3>
                  <p className="text-gray-400">
                    {filterStatus !== "all" || searchTerm 
                      ? "Try adjusting your filters or search terms"
                      : "You haven't placed any orders yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Details Dialog */}
        <Dialog
          open={openOrderDetailsDialog}
          onOpenChange={() => {
            setOpenOrderDetailsDailog(false);
            dispatch(resetOrderDetails());
          }}
        >
          {orderDetails && (
            <ShoppingOrderDetails orderDetails={orderDetails} />
          )}
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ShoppingOrders;