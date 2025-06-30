import React, { useEffect, useState } from "react";
import { addressFormControls } from "@/config";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
import { motion } from "framer-motion";

const initialAddressFormData = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

const ShopAddress = ({ setCurrentSelectedAddress }) => {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [showForm, setShowForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { addressList } = useSelector((s) => s.shoppingAddress);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddress({ userId: user.id }));
    }
  }, [dispatch, user]);

  // Simple 10‑digit check
  const isPhoneValid = (phone) =>
    /^[0-9]{10}$/.test(phone.replace(/\s+/g, ""));

  const isFormValid = () => isPhoneValid(formData.phone);

  const handleManageAddress = async (e) => {
    e.preventDefault();

    if (!isPhoneValid(formData.phone)) {
      return toast("Please enter a valid 10‑digit phone number", {
        variant: "destructive",
      });
    }

    if (!currentEditedId && addressList.length >= 3) {
      return toast("You can add max 3 Addresses", { variant: "destructive" });
    }

    if (currentEditedId) {
      // 👇 unwrap formData so the thunk payload shape matches addAddress
      const response = await dispatch(
        editAddress({
          userId: user.id,
          addressId: currentEditedId,
          ...formData,
        })
      );

      if (response.payload?.success) {
        toast(response.payload.message, { icon: "✅" });
        dispatch(fetchAllAddress({ userId: user.id }));
        setShowForm(false);
        setCurrentEditedId(null);
        setFormData(initialAddressFormData);
      }
    } else {
      const response = await dispatch(
        addAddress({ userId: user.id, ...formData })
      );

      if (response.payload?.success) {
        toast(response.payload.message, { icon: "✅" });
        dispatch(fetchAllAddress({ userId: user.id }));
        setShowForm(false);
        setFormData(initialAddressFormData);
      }
    }
  };

  const handleAddressEdit = (addressInfo) => {
    setCurrentEditedId(addressInfo._id);
    setShowForm(true);
    // 👇 initialize formData directly
    setFormData({
      address: addressInfo.address || "",
      city: addressInfo.city || "",
      pincode: addressInfo.pincode || "",
      phone: addressInfo.phone || "",
      notes: addressInfo.notes || "",
    });
  };

  console.log(formData,"editFormData")

  const handleAddressDelete = async (info) => {
    const response = await dispatch(
      deleteAddress({ userId: user.id, addressId: info._id })
    );
    if (response.payload?.success) {
      toast(response.payload.message, { icon: "✅" });
      dispatch(fetchAllAddress({ userId: user.id }));
    }
  };

  const handleAddNewAddress = () => {
    if (addressList.length >= 3) {
      return toast("You can add max 3 Addresses", { variant: "destructive" });
    }
    setShowForm(true);
    setCurrentEditedId(null);
    setFormData(initialAddressFormData);
  };

  const handleSelectedAddressId = (id) => setSelectedAddressId(id);

  return (
    <div className="w-full space-y-4">
      {addressList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl text-white">
            Saved Addresses ({addressList.length}/3)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {addressList.map((addr, i) => (
              <motion.div
                key={addr._id || i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <AddressCard
                  addressInfo={addr}
                  handleAddressDelete={handleAddressDelete}
                  handleAddressEdit={handleAddressEdit}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                  selectedAddressId={selectedAddressId}
                  handleSelectedAddressId={handleSelectedAddressId}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <button
          onClick={handleAddNewAddress}
          disabled={addressList.length >= 3}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
            addressList.length >= 3
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <MapPinPlus className="w-5 h-5" />
          Add New Address
        </button>
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <MapPinPlus className="w-5 h-5 text-blue-400" />
                {currentEditedId ? "Edit Address" : "Add New Address"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CommonForm
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                ButtonText={currentEditedId ? "Update Address" : "Add Address"}
                onSubmit={handleManageAddress}
                mode="dark"
                isButtonDisabled={!isFormValid()}
              />
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setCurrentEditedId(null);
                  setFormData(initialAddressFormData);
                }}
                className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {addressList.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MapPinPlus className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">
            No addresses saved yet. Click "Add New Address" to get started.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ShopAddress;
