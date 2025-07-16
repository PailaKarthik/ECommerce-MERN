import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ShoppingCart, Tag, ImageIcon } from "lucide-react";

const ShoppingProductTile = ({
  product,
  handleGetProductDetails,
  handleAddToCart,
  isMobile = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // default size if none provided
  const defaultSize =
    product?.pantSizes === "-" && product?.tshirtSizes === "-"
      ? "-"
      : null;

  // pick first valid image URL
  const getProductImage = () => {
    if (Array.isArray(product?.images) && product.images.length) {
      const valid = product.images.find(
        (img) => typeof img === "string" && img.trim() !== ""
      );
      return valid || null;
    }
    return product?.image || null;
  };

  const productImage = getProductImage();
  const hasValidImage = productImage && !imageError;

  const handleImageError = () => setImageError(true);
  const handleImageLoad = () => setImageError(false);

  // placeholder when no image
  const ImagePlaceholder = ({ className }) => (
    <div className={`bg-gray-700 flex items-center justify-center ${className}`}>
      <div className="text-center text-gray-400">
        <ImageIcon size={isMobile ? 24 : 48} className="mx-auto mb-1" />
        <p className="text-xs">No image</p>
      </div>
    </div>
  );

  // stock badge logic
  const getStockBadge = () => {
    if (product.quantity === 0) {
      return (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white font-bold px-2 py-1 text-xs flex items-center gap-1 z-10">
          Out of Stock
          <Tag size={8} />
        </Badge>
      );
    }
    if (product.quantity < 10) {
      return (
        <Badge className="absolute top-2 left-2 bg-amber-500 text-white font-bold px-2 py-1 text-xs flex items-center gap-1 z-10">
          {product.quantity} Left
          <Tag size={8} />
        </Badge>
      );
    }
    return (
      <Badge className="absolute top-2 left-2 bg-green-500 text-white font-bold px-2 py-1 text-xs flex items-center gap-1 z-10">
        In Stock
        <Tag size={8} />
      </Badge>
    );
  };

  // discount percentage
  const discountPercentage =
    product.sellPrice > 0 && product.price > product.sellPrice
      ? Math.round(
          ((product.price - product.sellPrice) / product.price) * 100
        )
      : 0;

  // MOBILE VARIANT
  if (isMobile) {
    return (
      <Card className="w-full bg-gray-800 text-gray-200 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 h-[340px] flex flex-col">
        <div
          onClick={() => handleGetProductDetails(product._id)}
          className="cursor-pointer hover:bg-gray-750 transition-colors flex-1 flex flex-col"
        >
          {/* IMAGE */}
          <div className="relative h-40 overflow-hidden flex-shrink-0">
            {hasValidImage ? (
              <img
                src={productImage}
                alt={product.title || "Product"}
                className="w-full h-full object-cover object-top"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <ImagePlaceholder className="w-full h-full" />
            )}

            {getStockBadge()}

            {discountPercentage > 0 && (
              <Badge className="absolute top-10 left-2 bg-red-500 text-white font-bold px-1.5 py-0.5 text-xs z-10">
                -{discountPercentage}%
              </Badge>
            )}

            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded z-10">
                +{product.images.length - 1}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-1 capitalize overflow-hidden line-clamp-2" style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.2',
                maxHeight: '2.4em'
              }}>
                {product.title || "Untitled Product"}
              </h3>
              <div className="flex items-center gap-1 text-gray-400 mb-2 text-xs">
                <span className="capitalize bg-gray-700 px-1.5 py-0.5 rounded text-xs">
                  {product.category || "N/A"}
                </span>
                <span>•</span>
                <span className="capitalize font-medium text-xs truncate">
                  {product.brand || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                {product.sellPrice > 0 && (
                  <span className="text-base font-bold text-green-400">
                    ₹{product.sellPrice}
                  </span>
                )}
                <span
                  className={`text-sm ${
                    product.sellPrice > 0
                      ? "line-through text-gray-500"
                      : "text-white font-semibold"
                  }`}
                >
                  ₹{product.price}
                </span>
              </div>
            </div>

            {product.quantity === 0 ? (
              <Button
                disabled
                className="w-full opacity-60 cursor-not-allowed bg-gray-700 text-gray-400 font-medium py-2 rounded text-xs flex items-center justify-center gap-1.5"
              >
                <ShoppingCart size={14} />
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product._id, product.quantity, defaultSize);
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // DESKTOP VARIANT
  return (
    <Card className="py-0 w-full max-w-sm mx-auto bg-gray-800 text-gray-200 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1">
      <div onClick={() => handleGetProductDetails(product._id)}>
        {/* IMAGE */}
        <div className="relative md:h-[300px] overflow-hidden">
          {hasValidImage ? (
            <img
              src={productImage}
              alt={product.title || "Product"}
              className="w-full h-[150px] md:h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <ImagePlaceholder className="w-full h-full" />
          )}

          <Badge
            className={`absolute top-2 left-2 font-bold px-2 py-1 text-xs flex items-center gap-1 z-10 ${
              product.quantity === 0
                ? "bg-red-500 text-white"
                : product.quantity < 10
                ? "bg-amber-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {product.quantity === 0
              ? "Out of Stock"
              : product.quantity < 10
              ? `${product.quantity} Left`
              : "In Stock"}
            <Tag size={12} />
          </Badge>

          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white font-bold px-2 py-1 text-xs z-10">
              -{discountPercentage}%
            </Badge>
          )}

          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded z-10">
              +{product.images.length - 1} more
            </div>
          )}
        </div>

        {/* DETAILS */}
        <CardContent className="p-1 md:p-4">
          <h2 className="text-md font-bold mb-2 capitalize line-clamp-2 group-hover:text-blue-400 transition-colors">
            {product.title || "Untitled Product"}
          </h2>
          <div className="flex items-center gap-1 text-gray-400 mb-3 text-sm">
            <span className="capitalize bg-gray-700 px-2 py-1 rounded text-xs">
              {product.category || "N/A"}
            </span>
            <span>•</span>
            <span className="capitalize font-medium">
              {product.brand || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {product.sellPrice > 0 && (
              <span className="text-sm font-bold text-green-400">
                ₹{product.sellPrice}.00
              </span>
            )}
            <span
              className={`text-sm ${
                product.sellPrice > 0
                  ? "line-through text-gray-500"
                  : "text-white font-semibold"
              }`}
            >
              ₹{product.price}.00
            </span>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0">
        {product.quantity === 0 ? (
          <Button
            disabled
            className="w-full opacity-60 cursor-not-allowed bg-gray-700 text-gray-400 font-semibold py-3 rounded-md flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product._id, product.quantity, defaultSize);
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;