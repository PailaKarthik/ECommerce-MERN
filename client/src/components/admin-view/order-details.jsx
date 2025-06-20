import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/orders-slice";
import { toast } from "sonner";

const initialFormData = {
  status: "",
};

const AdminOrderDetails = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    console.log("status", formData);
    const { status } = formData;
    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast(data?.payload.message, {
          icon: "✅",
          duration: 2000,
          position: "top-center",
          style: {
            backgroundColor: "black",
            color: "white",
          },
        });
      }
    });
  };

  return (
    <DialogContent className="bg-gray-800 border-gray-600 text-gray-300 sm:p-6 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[50vw] max-h-[90vh] overflow-y-auto ">
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
            <p className="font-medium">Payment ID</p>
            <Label className="text-gray-300">{orderDetails.paymentId}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payer Id</p>
            <Label className="text-gray-300">{orderDetails.payerId}</Label>
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
                    : orderDetails.orderStatus === "inShipping"
                    ? "text-yellow-400"
                    : "text-gray-200"
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
          <div>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  type: "select",
                  placeholder: "Select Product Category",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "rejected", label: "Rejected" },
                    { id: "delivered", label: "Delivered" },
                  ],
                  componentType: "select",
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              ButtonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
              mode="dark"
            ></CommonForm>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetails;
