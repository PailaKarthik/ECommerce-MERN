import { Minus, Plus, Trash, ImageIcon, Package, Ruler } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  updateCartItemQuantity,
} from "../../store/shop/cart-slice";
import { toast } from "sonner";
import { motion } from "framer-motion";

const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shoppingProducts);
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  console.log("cartIteminCart", cartItem);

  // Check if this is a shirting product
  const isShirtingProduct = cartItem?.category === "men-shirting";

  const handleDeleteItemInCart = async (productId) => {
    setIsDeleting(true);
    dispatch(deleteCartItem({ userId: user?.id, productId })).then(
      (response) => {
        if (response.payload?.success) {
          toast(response?.payload?.message, {
            icon: "✅",
            duration: 2000,
            position: "top-center",
            style: {
              backgroundColor: "#1f2937",
              color: "white",
              border: "1px solid #374151",
            },
          });
        }
        setIsDeleting(false);
      }
    );
  };

  const handleUpdateQuantity = async (getCartItem, quantityChange) => {
    // For regular products, check stock limits
    if (!isShirtingProduct && quantityChange === 1) {
      let indexOfCurrentItem = productList.findIndex(
        (item) => item._id === getCartItem?.productId
      );

      if (indexOfCurrentItem > -1) {
        const totalStock = productList[indexOfCurrentItem].quantity;

        if (getCartItem.quantity + quantityChange > totalStock) {
          toast(`Only ${totalStock} items available in stock`, {
            icon: "⚠️",
            duration: 3000,
            position: "top-center",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              border: "1px solid #ef4444",
            },
          });
          return;
        }
      }
    }

    setIsUpdating(true);

    // For shirting products, don't change quantity (always 1), but this shouldn't be called
    if (isShirtingProduct) {
      setIsUpdating(false);
      return;
    }

    dispatch(
      updateCartItemQuantity({
        userId: user?.id,
        productId: getCartItem.productId,
        quantity: getCartItem.quantity + quantityChange,
      })
    ).then((response) => {
      if (response.payload?.success) {
        toast(response?.payload?.message, {
          icon: "✅",
          duration: 1000,
          position: "top-center",
          style: {
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
          },
        });
      }
      setIsUpdating(false);
    });
  };

  const handleUpdateMeters = async (newMeters) => {
    if (newMeters <= 0 || newMeters > 100) {
      toast("Meters must be between 0.5 and 100", {
        icon: "⚠️",
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    setIsUpdating(true);

    dispatch(
      updateCartItemQuantity({
        userId: user?.id,
        productId: cartItem.productId,
        meters: newMeters,
      })
    ).then((response) => {
      if (response.payload?.success) {
        toast(response?.payload?.message, {
          icon: "✅",
          duration: 1000,
          position: "top-center",
          style: {
            backgroundColor: "#1f2937",
            color: "white",
            border: "1px solid #374151",
          },
        });
      }
      setIsUpdating(false);
    });
  };

  // Get the first valid image from the images array or fallback to single image
  const getProductImage = () => {
    console.log("CartItem data:", cartItem);

    if (
      cartItem?.images &&
      Array.isArray(cartItem.images) &&
      cartItem.images.length > 0
    ) {
      const validImage = cartItem.images.find(
        (img) => img && typeof img === "string" && img.trim() !== ""
      );
      if (validImage) {
        return validImage;
      }
    }

    if (
      cartItem?.image &&
      typeof cartItem.image === "string" &&
      cartItem.image.trim() !== ""
    ) {
      return cartItem.image;
    }

    if (
      cartItem?.productImage &&
      typeof cartItem.productImage === "string" &&
      cartItem.productImage.trim() !== ""
    ) {
      return cartItem.productImage;
    }

    if (
      cartItem?.thumbnail &&
      typeof cartItem.thumbnail === "string" &&
      cartItem.thumbnail.trim() !== ""
    ) {
      return cartItem.thumbnail;
    }

    return null;
  };

  const productImage = getProductImage();
  const hasValidImage = productImage && !imageError;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // Image placeholder component
  const ImagePlaceholder = () => (
    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center rounded-lg border border-gray-600 flex-shrink-0">
      <div className="text-center text-gray-400">
        <Package
          size={20}
          className="mx-auto mb-1 text-gray-500 lg:w-8 lg:h-8"
        />
        <p className="text-xs lg:text-sm">No image</p>
      </div>
    </div>
  );

  // Calculate item total - use totalCost for shirting, otherwise calculate normally
  const itemTotal =
    isShirtingProduct && cartItem?.totalCost
      ? cartItem.totalCost
      : (cartItem?.sellPrice > 0 ? cartItem?.sellPrice : cartItem?.price) *
        cartItem?.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex items-center gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-3 rounded-lg bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 backdrop-blur-sm ${
        isDeleting ? "opacity-50" : ""
      }`}
    >
      {/* Product Image - Larger on desktop */}
      <div className="flex-shrink-0">
        {hasValidImage ? (
          <div className="relative group">
            <img
              src={productImage}
              alt={cartItem.title}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 object-cover rounded-lg border border-gray-600 group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg"></div>
          </div>
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      {/* Product Details - Responsive layout */}
      <div className="flex-1 min-w-0">
        {/* Mobile/Tablet: Horizontal layout */}
        <div className="lg:hidden">
          <div className="flex flex-col items-start justify-between gap-2">
            {/* Left side - Product info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-100 font-semibold text-sm sm:text-base leading-tight mb-1 line-clamp-2">
                {cartItem.title}
              </h3>

              {/* Size - Compact display (only for non-shirting products) */}
              {!isShirtingProduct && cartItem.size && cartItem.size !== "-" && (
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs text-gray-400">Size:</span>
                  <span className="bg-gray-700 text-gray-200 px-1.5 py-0.5 rounded text-xs font-medium">
                    {cartItem.size}
                  </span>
                </div>
              )}

              {/* Meters display for shirting products */}
              {isShirtingProduct && cartItem.meters && (
                <div className="flex items-center gap-1 mb-1">
                  <Ruler className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-gray-400">Meters:</span>
                  <span className="text-orange-400 text-xs font-medium">
                    {cartItem.meters}m
                  </span>
                </div>
              )}

              {/* Quantity Controls - Only for non-shirting products */}
              {!isShirtingProduct && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs text-gray-400">Qty:</span>
                  <div className="flex items-center border border-gray-600 rounded bg-gray-800/50">
                    <Button
                      disabled={cartItem.quantity <= 1 || isUpdating}
                      onClick={() => handleUpdateQuantity(cartItem, -1)}
                      className="bg-transparent text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 p-0.5 sm:p-1.5 border-0 rounded-l transition-colors duration-200 disabled:opacity-50 h-auto"
                    >
                      <Minus className="w-2 h-2 sm:w-4 sm:h-4" />
                    </Button>

                    <div className="py-1 font-bold text-gray-100 bg-gray-800/70 text-xs sm:text-sm text-center min-w-[2rem] sm:min-w-[2.5rem]">
                      {cartItem.quantity}
                    </div>

                    <Button
                      disabled={isUpdating}
                      onClick={() => handleUpdateQuantity(cartItem, 1)}
                      className="bg-transparent text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 p-0.5 sm:p-1.5 border-0 rounded-r transition-colors duration-200 h-auto"
                    >
                      <Plus className="w-2 h-2 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Meter controls for shirting products - Mobile */}
              {isShirtingProduct && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs text-gray-400">Update:</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min="0.5"
                      max="100"
                      step="0.5"
                      defaultValue={cartItem.meters}
                      className="w-16 h-6 text-xs bg-gray-700 border-gray-600 text-white"
                      onBlur={(e) => {
                        const newMeters = parseFloat(e.target.value);
                        if (newMeters !== cartItem.meters && newMeters > 0) {
                          handleUpdateMeters(newMeters);
                        }
                      }}
                    />
                    <span className="text-xs text-gray-400">m</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Price and Actions */}
            <div className="flex items-end justify-between gap-2 sm:gap-2 flex-shrink-0">
              {/* Price */}
              <div className="flex gap-1 items-center text-right">
                <p className="text-green-400 font-bold text-sm sm:text-base">
                  ₹{Math.floor(itemTotal)}
                </p>
                {!isShirtingProduct &&
                  cartItem.sellPrice > 0 &&
                  cartItem.sellPrice < cartItem.price && (
                    <p className="text-gray-400 text-xs line-through">
                      ₹{(cartItem.price * cartItem.quantity).toFixed(2)}
                    </p>
                  )}
                {isShirtingProduct && (
                  <p className="text-xs text-gray-400">({cartItem.meters}m)</p>
                )}
              </div>

              {/* Delete Button */}
              <Button
                disabled={isDeleting}
                onClick={() => handleDeleteItemInCart(cartItem?.productId)}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 p-1.5 sm:p-2 rounded transition-all duration-200 group h-auto"
              >
                <Trash className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop: Vertical layout with more space */}
        <div className="hidden lg:flex lg:flex-col lg:justify-between lg:h-full lg:min-h-[8rem]">
          {/* Top section - Title and Size/Meters */}
          <div className="mb-4">
            <h3 className="text-gray-100 font-semibold text-xl leading-tight mb-3 line-clamp-2">
              {cartItem.title}
            </h3>

            {/* Size for non-shirting products */}
            {!isShirtingProduct && cartItem.size && cartItem.size !== "-" && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">Size:</span>
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-md text-sm font-medium">
                  {cartItem.size}
                </span>
              </div>
            )}

            {/* Meters for shirting products */}
            {isShirtingProduct && cartItem.meters && (
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-400">Quantity:</span>
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-md text-sm font-medium border border-orange-500/30">
                  {cartItem.meters} meters
                </span>
              </div>
            )}
          </div>

          {/* Middle section - Quantity/Meters and Price */}
          <div className="flex items-center justify-between mb-4">
            {/* Quantity Controls for non-shirting products */}
            {!isShirtingProduct && (
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-400 font-medium">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800/50">
                  <Button
                    disabled={cartItem.quantity <= 1 || isUpdating}
                    onClick={() => handleUpdateQuantity(cartItem, -1)}
                    className="bg-transparent text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 p-1 border-0 rounded-l-lg transition-colors duration-200 disabled:opacity-50 h-auto"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <div className="p-1 font-bold text-gray-100 bg-gray-800/70 text-base text-center min-w-[3rem]">
                    {cartItem.quantity}
                  </div>

                  <Button
                    disabled={isUpdating}
                    onClick={() => handleUpdateQuantity(cartItem, 1)}
                    className="bg-transparent text-gray-300 hover:text-orange-400 hover:bg-gray-700/50 p-1 border-0 rounded-r-lg transition-colors duration-200 h-auto"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Meter controls for shirting products - Desktop */}
            {isShirtingProduct && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-medium">
                  Update Meters:
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    defaultValue={cartItem.meters}
                    className="w-20 bg-gray-700 border-gray-600 text-white"
                    onBlur={(e) => {
                      const newMeters = parseFloat(e.target.value);
                      if (newMeters !== cartItem.meters && newMeters > 0) {
                        handleUpdateMeters(newMeters);
                      }
                    }}
                  />
                  <span className="text-gray-400">meters</span>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="text-right">
              <p className="text-green-400 font-semibold text-lg mb-1">
                ₹{Math.floor(itemTotal)}
              </p>
              {!isShirtingProduct &&
                cartItem.sellPrice > 0 &&
                cartItem.sellPrice < cartItem.price && (
                  <p className="text-gray-400 text-sm line-through">
                    ₹{(cartItem.price * cartItem.quantity).toFixed(2)}
                  </p>
                )}
              {isShirtingProduct && (
                <p className="text-gray-400 text-sm">
                  {cartItem.meters}m × ₹
                  {(cartItem.totalCost / cartItem.meters).toFixed(2)}/m
                </p>
              )}
            </div>
          </div>

          {/* Bottom section - Delete Button */}
          <div className="flex justify-end">
            <Button
              disabled={isDeleting}
              onClick={() => handleDeleteItemInCart(cartItem?.productId)}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 px-4 py-2 rounded-lg transition-all duration-200 group flex items-center gap-2"
            >
              <Trash className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Remove Item</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCartItemsContent;
