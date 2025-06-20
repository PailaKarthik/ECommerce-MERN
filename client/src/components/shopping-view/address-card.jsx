import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Trash, EditIcon } from "lucide-react";

const AddressCard = ({
  addressInfo,
  handleAddressDelete,
  handleAddressEdit,
  setCurrentSelectedAddress,
  selectedAddressId,
  handleSelectedAddressId,
}) => {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => {
              setCurrentSelectedAddress(addressInfo);
              handleSelectedAddressId(addressInfo?._id);
            }
          : null
      }
      className={`bg-gray-700 border-gray-500 ${
        selectedAddressId === addressInfo?._id ? "border-green-500 border-2" : ""
      }`}
    >
      <CardContent className="bg-gray-700 text-gray-300 grid gap-4 capitalize">
        <Label>
          <span className="font-bold text-orange-50">Address : </span>{" "}
          {addressInfo?.address}
        </Label>
        <Label>
          <span className="font-bold text-orange-50">City : </span>
          {addressInfo?.city}
        </Label>
        <Label>
          <span className="font-bold text-orange-50">PinCode : </span>
          {addressInfo?.pincode}
        </Label>
        <Label>
          <span className="font-bold text-orange-50">Phone : </span>
          {addressInfo?.phone}
        </Label>
        <Label> {addressInfo?.notes}</Label>
      </CardContent>

      <CardFooter className="gap-2 overflow-auto">
        <Button
          onClick={() => handleAddressEdit(addressInfo)}
          className="bg-gray-800 hover:bg-gray-900"
        >
          <EditIcon className="text-green-400" /> Edit
        </Button>
        <Button
          onClick={() => handleAddressDelete(addressInfo)}
          className="bg-gray-800 hover:bg-gray-900"
        >
          <Trash className="text-red-300" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
