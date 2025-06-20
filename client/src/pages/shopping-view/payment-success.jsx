import React from "react";
import { BadgeCheck, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-[95vh] items-center justify-center border-gray-600  shadow-gray-700 bg-gray-900 text-gray-200 p-4 ">
      <div className="p-4 flex flex-col gap-2 rounded-lg bg-gray-800 text-gray-200 shadow-sm hover:shadow-lg border-gray-600 shadow-gray-600 transition-all duration-200 ">
        <div className="flex gap-2 items-center justify-center">
          <h1 className="font-extrabold text-xl md:text-3xl">Payment Successful </h1>
          <BadgeCheck className="text-green-500" />
        </div>
        <div className="mt-1 md:mt-4 flex-col flex gap-5 ">
          <div className="flex-col flex gap-1 text-gray-400 text-sm md:text-md">
            <span>
              • Your order was recieved. We should check your payment and track
              your Order
            </span>
            <span>• Your cart was successfully cleared.</span>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => navigate("/shop/home")}
              className="bg-gray-200 hover:bg-gray-300 border-gray-700 text-gray-700 hover:text-gray-800"
            >
              <p className="flex items-center gap-1">
                Shop More <SquareArrowOutUpRight />
              </p>
            </Button>
            <Button
              onClick={() => navigate("/shop/account")}
              className="bg-gray-200 hover:bg-gray-300 border-gray-700 text-gray-700 hover:text-gray-800"
            >
              <p className="flex items-center gap-1">
                Orders <SquareArrowOutUpRight />
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
