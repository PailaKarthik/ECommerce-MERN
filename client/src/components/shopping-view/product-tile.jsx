import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ShoppingCart, Tag, ImageIcon } from "lucide-react";

const ShoppingProductTile = ({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) => {
  const [imageError, setImageError] = useState(false);

  // Decide default size: '-' if both pant and tshirt sizes are unavailable
  const defaultSize =
    product?.pantSizes === "-" && product?.tshirtSizes === "-"
      ? "-"
      : null;

  // Get the first valid image from the images array
  const getProductImage = () => {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      // Find the first valid image URL
      const validImage = product.images.find(img => 
        img && typeof img === 'string' && img.trim() !== ''
      );
      return validImage || null;
    }
    // Fallback: check if there's a single image property (for backward compatibility)
    return product?.image || null;
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
    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <ImageIcon size={48} className="mx-auto mb-2" />
        <p className="text-sm">No image</p>
      </div>
    </div>
  );

  // Get stock badge based on quantity
  const getStockBadge = () => {
    if (product?.quantity === 0) {
      return (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white font-bold px-2 py-1 text-xs tracking-wider flex items-center gap-1">
          Out of Stock
          <Tag size={12} />
        </Badge>
      );
    } else if (product?.quantity < 10) {
      return (
        <Badge className="absolute top-2 left-2 bg-amber-500 text-white font-bold px-2 py-1 text-xs tracking-wider flex items-center gap-1">
          {`${product.quantity} Left`}
          <Tag size={12} />
        </Badge>
      );
    } else {
      return (
        <Badge className="absolute top-2 left-2 bg-green-500 text-white font-bold px-2 py-1 text-xs tracking-wider flex items-center gap-1">
          In Stock
          <Tag size={12} />
        </Badge>
      );
    }
  };

  // Get discount percentage if there's a sell price
  const getDiscountPercentage = () => {
    if (product?.sellPrice > 0 && product?.price > product?.sellPrice) {
      const discount = Math.round(((product.price - product.sellPrice) / product.price) * 100);
      return discount;
    }
    return 0;
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <Card className="py-0 w-full max-w-sm mx-auto bg-gray-800 text-gray-200 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative h-[300px] overflow-hidden">
          {hasValidImage ? (
            <img
              src={productImage}
              alt={product?.title || 'Product'}
              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <ImagePlaceholder />
          )}
          
          {/* Stock Badge */}
          {getStockBadge()}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white font-bold px-2 py-1 text-xs">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Multiple Images Indicator */}
          {product?.images && Array.isArray(product.images) && product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              +{product.images.length - 1} more
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 capitalize line-clamp-2 group-hover:text-blue-400 transition-colors">
            {product?.title || 'Untitled Product'}
          </h2>
          
          <div className="flex items-center gap-2 text-gray-400 mb-3 text-sm">
            <span className="capitalize bg-gray-700 px-2 py-1 rounded text-xs">
              {product?.category || 'N/A'}
            </span>
            <span className="text-gray-500">•</span>
            <span className="capitalize font-medium">
              {product?.brand || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            {product?.sellPrice > 0 && (
              <span className="text-xl font-bold text-green-400">
                ₹{product.sellPrice}.00
              </span>
            )}
            <span
              className={`text-lg ${
                product?.sellPrice > 0 
                  ? "line-through text-gray-500" 
                  : "text-white font-semibold"
              }`}
            >
              ₹{product?.price || 0}.00
            </span>
          </div>

          {/* Size Information */}
          <div className="text-xs text-gray-400 mt-2">
            {product?.pantSizes !== "-" && product?.pantSizes && (
              <span className="bg-gray-700 px-2 py-1 rounded mr-2">
                Pant: {product.pantSizes}
              </span>
            )}
            {product?.tshirtSizes !== "-" && product?.tshirtSizes && (
              <span className="bg-gray-700 px-2 py-1 rounded">
                T-Shirt: {product.tshirtSizes}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0">
        {product?.quantity === 0 ? (
          <Button 
            disabled
            className="w-full opacity-60 cursor-not-allowed bg-gray-700 text-gray-400 font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              handleAddToCart(product._id, product.quantity, defaultSize);
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
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