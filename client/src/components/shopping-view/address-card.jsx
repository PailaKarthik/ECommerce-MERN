import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Trash, EditIcon, MapPin, Phone, Hash, StickyNote, CheckCircle } from "lucide-react";

const AddressCard = ({
  addressInfo,
  handleAddressDelete,
  handleAddressEdit,
  setCurrentSelectedAddress,
  selectedAddressId,
  handleSelectedAddressId,
}) => {
  const isSelected = selectedAddressId === addressInfo?._id;

  const handleCardClick = () => {
    if (setCurrentSelectedAddress) {
      setCurrentSelectedAddress(addressInfo);
      handleSelectedAddressId(addressInfo?._id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    handleAddressEdit(addressInfo);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleAddressDelete(addressInfo);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`
        relative transition-all duration-200 cursor-pointer transform hover:scale-[1.02] 
        bg-gray-800 border-2 
        ${isSelected 
          ? 'border-green-500 shadow-lg shadow-green-500/20 bg-gray-750' 
          : 'border-gray-600 hover:border-gray-500'
        }
      `}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-green-500 rounded-full p-1">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {/* Address */}
        <div className="flex items-start gap-2 sm:gap-3">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <Label className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide">
              Address
            </Label>
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed break-words">
              {addressInfo?.address}
            </p>
          </div>
        </div>

        {/* City & Pincode Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <Label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                City
              </Label>
              <p className="text-sm sm:text-base text-white capitalize truncate">
                {addressInfo?.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <Label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Pincode
              </Label>
              <p className="text-sm sm:text-base text-white font-mono">
                {addressInfo?.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <Label className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide">
              Phone
            </Label>
            <p className="text-sm sm:text-base text-white font-mono">
              {addressInfo?.phone}
            </p>
          </div>
        </div>

        {/* Notes */}
        {addressInfo?.notes && (
          <div className="flex items-start gap-2 sm:gap-3">
            <StickyNote className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <Label className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide">
                Notes
              </Label>
              <p className="text-sm sm:text-base text-gray-300 italic leading-relaxed break-words">
                {addressInfo?.notes}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className=" flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          onClick={handleEditClick}
          size="sm"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 text-xs sm:text-sm p-1"
        >
          <EditIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Edit
        </Button>
        <Button
          onClick={handleDeleteClick}
          size="sm"
          variant="destructive"
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200 text-xs sm:text-sm p-1"
        >
          <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Delete
        </Button>
      </CardFooter>

      {/* Selection Overlay */}
      {setCurrentSelectedAddress && (
        <div className={`
          absolute inset-0 pointer-events-none transition-opacity duration-200 rounded-lg
          ${isSelected ? 'bg-green-500/5' : 'hover:bg-white/5'}
        `} />
      )}
    </Card>
  );
};

export default AddressCard;