import React from "react";
import accImage from "../../assets/account.jpg";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import ShoppingOrders from "../../components/shopping-view/orders";
import ShopAddress from "../../components/shopping-view/address";

const ShoppingAccount = () => {
  return (
    <div className="flex flex-col bg-gray-900 min-h-screen">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={accImage} className="h-full w-full object-cover object-top" />
      </div>
      <div className="p-2 md:p-4 lg:p-8 grid grid-cols-1 gap-8 ">
        <div className="flex flex-col rounded-lg border p-4 lg:p-6 bg-gray-800 shadow-lg border-gray-600">
          <Tabs defaultValue="orders">
            <TabsList className="bg-gray-700">
              <TabsTrigger value="orders" className="cursor-pointer dark ">
                Orders
              </TabsTrigger>
              <TabsTrigger value="address" className="cursor-pointer dark">
                Address
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <ShopAddress />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
