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
import { SquareArrowOutUpRight } from "lucide-react";
import { Badge } from "../ui/badge";

const AdminOrdersList = () => {
  const [openOrderDetailsDialog, setOpenOrderDetailsDialog] = useState(false);
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

  return (
    <motion.div
      initial={{ opacity: 20, y: -20 }}
      animate={{ opacity: 100, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="mt-4 bg-gray-800 text-gray-200 border-0 shadow-sm shadow-gray-500 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Table className="table-fixed w-full">
            <TableHeader className="table-fixed w-full sticky top-0 z-10 bg-gray-800">
              <TableRow className="table-fixed w-full">
                <TableHead className="text-gray-200">Order ID</TableHead>
                <TableHead className="text-gray-200">Order Date</TableHead>
                <TableHead className="text-gray-200">Order Status</TableHead>
                <TableHead className="text-gray-200">Order Price</TableHead>
                <TableHead className="sr-only"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-fixed w-full">
              {orderList && orderList.length > 0
                ? orderList.map((order) => (
                    <TableRow key={order._id} className="table-fixed w-full  border-b-gray-700">
                      <TableCell>{order._id}</TableCell>
                      <TableCell>
                        {order.orderDate
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join(" / ")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            order.orderStatus === "confirmed"
                              ? "text-blue-400"
                              : order.orderStatus === "rejected"
                              ? "text-red-400"
                              : order.orderStatus === "delivered"
                              ? "text-green-400"
                              : order.orderStatus === "inShipping"
                              ? "text-yellow-400"
                              : "text-gray-200"
                          } capitalize font-semibold bg-gray-700`}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹ {order.totalAmount}.00
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={openOrderDetailsDialog}
                          onOpenChange={() => {
                            setOpenOrderDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() => handleFetchOrderDetails(order._id)}
                            className="bg-gray-900"
                          >
                            view Details <SquareArrowOutUpRight />
                          </Button>
                          {orderDetails && (
                            <AdminOrderDetails orderDetails={orderDetails} />
                          )}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminOrdersList;
