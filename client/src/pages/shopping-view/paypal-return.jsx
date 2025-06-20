import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";

const PaypalReturnPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const payerId = params.get("PayerID");

  console.log(payerId);
  useEffect(() => {
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    if (orderId && payerId) {
      dispatch(capturePayment({ orderId, payerId })).then((data) => {
        if (data?.payload.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [dispatch, payerId]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-10 gap-2 min-h-screen">
      <div
        class="w-8 h-8 border-4 border-gray-200 border-t-orange-300 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      ></div>
      <p className="text-gray-500">Processing <span className="text-gray-400 font-bold">Payment</span>.. Please wait</p>
    </div>
  );
};

export default PaypalReturnPage;
