import React, { useEffect, useState } from "react";
import { addressFormControls } from "@/config";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import CommonForm from "../common/form";
import { MapPinPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  fetchAllAddress,
  deleteAddress,
  editAddress,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";

const initialAddressFormData = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};
import { motion } from "framer-motion";

const ShopAddress = ({setCurrentSelectedAddress}) => {
  const [formData, setFormData] = useState(initialAddressFormData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shoppingAddress);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleSelectedAddressId = (addressId) => {
    setSelectedAddressId(addressId);
  }

  const handleManageAddress = (e) => {
    e.preventDefault();

    if (addressList?.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast("You can add max 3 Addresses", {
        variant : "destructive",
        icon: "😢",
        duration: 2000,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      return;
    }

    if (currentEditedId) {
      dispatch(
        editAddress({ userId: user?.id, addressId: currentEditedId, formData })
      ).then((response) => {
        if (response?.payload?.success) {
          dispatch(fetchAllAddress({ userId: user?.id }));
          setFormData(initialAddressFormData);
          setCurrentEditedId(null);
          toast(response?.payload.message, {
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
    } else {
      dispatch(addAddress({ userId: user?.id, ...formData })).then(
        (response) => {
          if (response?.payload?.success) {
            dispatch(fetchAllAddress({ userId: user?.id }));
            setFormData(initialAddressFormData);
            toast(response?.payload.message, {
              icon: "✅",
              duration: 2000,
              position: "top-center",
              style: {
                backgroundColor: "black",
                color: "white",
              },
            });
          }
        }
      );
    }
  };

  useEffect(() => {
    dispatch(fetchAllAddress({ userId: user?.id }));
  }, [dispatch, user]);

  console.log("addressList", addressList);

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  const handleAddressEdit = (addressInfo) => {
    setCurrentEditedId(addressInfo._id);
    setFormData({
      ...formData,
      address: addressInfo?.address,
      city: addressInfo?.city,
      phone: addressInfo?.phone,
      pincode: addressInfo?.pincode,
      notes: addressInfo?.notes,
    });
  };

  const handleAddressDelete = (addressInfo) => {
    dispatch(
      deleteAddress({
        userId: user?.id,
        addressId: addressInfo._id,
      })
    ).then((response) => {
      if (response?.payload?.success) {
        dispatch(fetchAllAddress({ userId: user?.id }));
        toast(response?.payload.message, {
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
    <Card className="mt-2 md:mt-4 bg-gray-800 text-gray-200 border-0 shadow-sm shadow-gray-300 ">
      <motion.div
      initial = {{opacity : 0,y : -20}}
      animate = {{opacity : 100,y : 0}}
      transition={{duration : 0.7}}
       className="px-3 grid grid-cols-1 sm:grid-cols-2  gap-4">
        {addressList && addressList?.length > 0
          ? addressList.map((address, index) => (
              <AddressCard
                key={index}
                addressInfo={address}
                handleAddressDelete={handleAddressDelete}
                handleAddressEdit={handleAddressEdit}
                setCurrentSelectedAddress ={setCurrentSelectedAddress}
                selectedAddressId = {selectedAddressId}
                handleSelectedAddressId = {handleSelectedAddressId}
                />
            ))
          : null}
      </motion.div>
      <CardHeader>
        <CardTitle className="flex gap-1 items-center ">
          <MapPinPlus className="w-5 h-5" />
          {currentEditedId ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          ButtonText={currentEditedId ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          mode="dark"
          isButtonDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default ShopAddress;
