import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ImageIcon } from "lucide-react";

const AdminProductTile = ({
  product,
  setFormData,
  setOpenAddProducts,
  setCurrentEditedId,
  handleDeleteProduct
}) => {
  const [imageError, setImageError] = useState(false);

  const handleEditButton = () => {
    setCurrentEditedId(product._id);
    setOpenAddProducts(true);
    setFormData({ ...product });
  };

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
    <div className="w-full h-[300px] bg-gray-700 rounded-t-lg flex items-center justify-center">
      <div className="text-center text-gray-400">
        <ImageIcon size={48} className="mx-auto mb-2" />
        <p className="text-sm">No image</p>
      </div>
    </div>
  );

  return (
    <Card className="w-full pt-0 max-w-sm mx-auto bg-gray-800 text-gray-200 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className="relative">
          {hasValidImage ? (
            <img
              src={productImage}
              alt={product?.title || 'Product'}
              className="w-full h-[300px] object-cover object-top rounded-t-lg"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <ImagePlaceholder />
          )}
          
          {/* Optional: Add a badge showing number of images */}
          {product?.images && Array.isArray(product.images) && product.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              +{product.images.length - 1} more
            </div>
          )}
        </div>
        
        <CardContent className="text-center p-4">
          <h2 className="text-xl font-semibold mb-2 capitalize line-clamp-2">
            {product?.title || 'Untitled Product'}
          </h2>
          
          <div className="flex justify-center items-center mb-2 gap-2">
            {product?.sellPrice > 0 && (
              <span className="text-lg font-bold text-green-400">
                ₹{product.sellPrice}.00
              </span>
            )}
            <span
              className={`${
                product?.sellPrice > 0 
                  ? "line-through text-gray-400" 
                  : "text-white"
              } text-lg font-semibold`}
            >
              ₹{product?.price || 0}.00
            </span>
          </div>
          
          {/* Additional product info */}
          <div className="text-sm text-gray-400 space-y-1">
            {product?.category && (
              <p><span className="font-medium">Category:</span> {product.category}</p>
            )}
            {product?.brand && (
              <p><span className="font-medium">Brand:</span> {product.brand}</p>
            )}
            {product?.quantity !== undefined && (
              <p className={`font-medium ${product.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.quantity > 0 ? `In Stock: ${product.quantity}` : 'Out of Stock'}
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-3 justify-center items-center p-4 pt-0">
          <Button 
            onClick={handleEditButton} 
            className="bg-gray-900 hover:bg-gray-700 text-green-500 border-0 flex-1"
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleDeleteProduct(product._id)} 
            className="bg-gray-900 hover:bg-gray-700 text-red-300 border-0 flex-1"
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default AdminProductTile;