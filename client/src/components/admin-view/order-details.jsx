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
  Home,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";

const initialFormData = {
  status: "",
};

const AdminOrderDetails = ({ orderDetails }) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      case "inShipping":
        return <Truck className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return dateString
      .split("T")[0]
      .split("-")
      .reverse()
      .join(" / ");
  };

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-gray-600/30 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold text-gray-200">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0">
      <div className="flex items-center gap-2 text-gray-400">
        {Icon && <Icon className="w-4 h-4" />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-gray-200 text-sm font-medium max-w-[60%] text-right break-words">
        {value}
      </div>
    </div>
  );

  return (
    <DialogContent className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50 text-gray-100 sm:p-6 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[95vh] overflow-hidden">
      <div className="max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Order Details
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Order ID:</span>
            <code className="bg-gray-700/50 px-2 py-1 rounded text-xs font-mono text-gray-200 break-all">
              {orderDetails._id}
            </code>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Order Information */}
          <InfoCard icon={FileText} title="Order Information">
            <InfoRow 
              label="Order Date" 
              value={formatDate(orderDetails.orderDate)}
              icon={Calendar}
            />
            <InfoRow 
              label="Total Amount" 
              value={`₹${orderDetails.totalAmount}.00`}
              icon={DollarSign}
            />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge className={`${getStatusColor(orderDetails.orderStatus)} capitalize font-medium border px-3 py-1 rounded-full flex items-center gap-2`}>
                {getStatusIcon(orderDetails.orderStatus)}
                {orderDetails.orderStatus}
              </Badge>
            </div>
          </InfoCard>

          {/* Payment Information */}
          <InfoCard icon={CreditCard} title="Payment Information">
            <InfoRow 
              label="Payment ID" 
              value={orderDetails.paymentId}
            />
            <InfoRow 
              label="Payer ID" 
              value={orderDetails.payerId}
            />
            <InfoRow 
              label="Payment Method" 
              value={orderDetails.paymentMethod}
            />
            <InfoRow 
              label="Payment Status" 
              value={orderDetails.paymentStatus}
            />
          </InfoCard>

          {/* Order Items */}
          <InfoCard icon={ShoppingCart} title="Order Items">
            <div className="space-y-3">
              {orderDetails.cartItems && orderDetails.cartItems.length > 0
                ? orderDetails.cartItems.map((product, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Product:</span>
                          <p className="text-gray-200 font-medium break-words">{product.title}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Size:</span>
                          <p className="text-gray-200 font-medium">{product.size}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Quantity:</span>
                          <p className="text-gray-200 font-medium">{product.quantity}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Price:</span>
                          <p className="text-green-400 font-bold">₹{product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                : <p className="text-gray-400 text-center py-4">No items found</p>}
            </div>
          </InfoCard>

          {/* Shipping Information */}
          <InfoCard icon={MapPin} title="Shipping Information">
            <InfoRow 
              label="Customer Name" 
              value={orderDetails?.userName}
              icon={User}
            />
            <InfoRow 
              label="Address" 
              value={orderDetails.addressInfo.address}
              icon={Home}
            />
            <InfoRow 
              label="City" 
              value={orderDetails.addressInfo.city}
            />
            <InfoRow 
              label="Pincode" 
              value={orderDetails.addressInfo.pincode}
            />
            <InfoRow 
              label="Phone" 
              value={orderDetails.addressInfo.phone}
              icon={Phone}
            />
            {orderDetails.addressInfo.notes && (
              <InfoRow 
                label="Notes" 
                value={orderDetails.addressInfo.notes}
                icon={FileText}
              />
            )}
          </InfoCard>

          {/* Status Update Form */}
          <InfoCard icon={Truck} title="Update Order Status" className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
              <CommonForm
                formControls={[
                  {
                    label: "Order Status",
                    name: "status",
                    type: "select",
                    placeholder: "Select Order Status",
                    options: [
                      { id: "pending", label: "Pending" },
                      { id: "inProcess", label: "In Process" },
                      { id: "inShipping", label: "In Shipping" },
                      { id: "delivered", label: "Delivered" },
                      { id: "rejected", label: "Rejected" },
                    ],
                    componentType: "select",
                  },
                ]}
                formData={formData}
                setFormData={setFormData}
                ButtonText="Update Order Status"
                onSubmit={handleUpdateStatus}
                mode="dark"
              />
            </div>
          </InfoCard>
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetails;