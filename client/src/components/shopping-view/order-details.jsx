import React from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const ShoppingOrderDetails = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <DialogContent className="bg-gray-800 border-gray-600 text-gray-100 sm:p-6 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="mt-6 flex items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label className="text-gray-300">{orderDetails._id}</Label>
          </div>
          <div className=" flex items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label className="text-gray-300">
              {orderDetails.orderDate
                .split("T")[0]
                .split("-")
                .reverse()
                .join(" / ")}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label className="text-gray-300">
              ₹ {orderDetails.totalAmount}.00
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label className="text-gray-300">
              {orderDetails.paymentMethod}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label className="text-gray-300">
              {orderDetails.paymentStatus}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label className="text-gray-300">
              <Badge
                className={`${
                  orderDetails.orderStatus === "confirmed"
                    ? "text-blue-400"
                    : orderDetails.orderStatus === "rejected"
                    ? "text-red-400"
                    : orderDetails.orderStatus === "delivered"
                    ? "text-green-400"
                    :  orderDetails.orderStatus === "inShipping"
                    ? "text-yellow-400": "text-gray-200"
                } capitalize font-semibold bg-gray-700`}
              >
                {orderDetails.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-bold">Order Details</div>
            {orderDetails.cartItems && orderDetails.cartItems.length > 0
              ? orderDetails.cartItems.map((product, index) => (
                  <ul key={index} className="grid gap-3">
                    <li className="flex items-center justify-between text-gray-300">
                      <span>Title: {product.title}</span>
                      <span>Size : {product.size}</span>
                      <span>Quantity : {product.quantity}</span>
                      <span>Price : ₹{product.price}</span>
                    </li>
                  </ul>
                ))
              : null}
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="font-medium">Shipping info</div>
            <div className="grid gap-0.5 text-gray-300">
              <span>
                Name : <span className="text-gray-400">{user.username}</span>
              </span>
              <span>
                Address :{" "}
                <span className="text-gray-400">
                  {orderDetails.addressInfo.address}
                </span>
              </span>
              <span>
                City :{" "}
                <span className="text-gray-400">
                  {orderDetails.addressInfo.city}
                </span>
              </span>
              <span>
                Pincode :{" "}
                <span className="text-gray-400">
                  {orderDetails.addressInfo.pincode}
                </span>
              </span>
              <span>
                Phone :{" "}
                <span className="text-gray-400">
                  {orderDetails.addressInfo.phone}
                </span>
              </span>
              <span>
                Notes :{" "}
                <span className="text-gray-400">
                  {orderDetails.addressInfo.notes}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShoppingOrderDetails;
