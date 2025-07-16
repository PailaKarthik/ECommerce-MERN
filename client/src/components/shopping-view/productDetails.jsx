import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ShoppingCart, MessageSquareMore, ChevronLeft, ChevronRight, ImageIcon, Package } from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSelector, useDispatch } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import { motion } from "framer-motion";
import StarRatingComponent from "../common/star-rating";
import { toast } from "sonner";
import { addProductReview, getProductReviews } from "@/store/shop/review-slice";

const ProductDetailsDialog = ({ open, setOpen, productDetails, handleAddToCart }) => {
  const [size, setSize] = useState(null);
  const [reviewMsg, setReviewMsg] = useState("-");
  const [rating, setRating] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [imageError, setImageError] = useState({});
  
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { productReviews } = useSelector((state) => state.shoppingReview);
  
  // Safe default array with proper validation
  const images = productDetails?.images && Array.isArray(productDetails.images) 
    ? productDetails.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : [];
  
  const hasValidImages = images.length > 0;

  // Parse sizes from the format "L=21,M=8,S=12"
  const parseSizes = (sizesString) => {
    if (!sizesString || sizesString === "-") return [];
    
    return sizesString.split(',').map(item => {
      const [size, quantity] = item.trim().split('=');
      return {
        size: size?.trim(),
        quantity: parseInt(quantity) || 0
      };
    }).filter(item => item.size && item.quantity > 0);
  };

  // Get available sizes with quantities
  const availableSizes = React.useMemo(() => {
    // Handle both new format and backward compatibility
    let sizesString = "";
    
    if (productDetails?.sizes) {
      sizesString = productDetails.sizes;
    } else {
      // Backward compatibility with tshirtSizes and pantSizes
      const tshirtSizes = productDetails?.tshirtSizes && productDetails.tshirtSizes !== "-" ? productDetails.tshirtSizes : "";
      const pantSizes = productDetails?.pantSizes && productDetails.pantSizes !== "-" ? productDetails.pantSizes : "";
      
      if (tshirtSizes && pantSizes) {
        sizesString = `${tshirtSizes},${pantSizes}`;
      } else if (tshirtSizes) {
        sizesString = tshirtSizes;
      } else if (pantSizes) {
        sizesString = pantSizes;
      }
    }
    
    return parseSizes(sizesString);
  }, [productDetails]);

  // Check if sizes are available
  const hasSizes = availableSizes.length > 0;
  
  useEffect(() => {
    if (productDetails) {
      setSlideIdx(0);
      setImageError({});
      setSize(hasSizes ? null : "-");
      dispatch(getProductReviews(productDetails._id));
    }
  }, [productDetails, dispatch, hasSizes]);
  
  if (!productDetails) return null;

  const nextSlide = () => {
    if (hasValidImages) {
      setSlideIdx((i) => (i + 1) % images.length);
    }
  };

  const prevSlide = () => {
    if (hasValidImages) {
      setSlideIdx((i) => (i - 1 + images.length) % images.length);
    }
  };

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const averageRating =
    productReviews && productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.reviewValue, 0) / productReviews.length
      : 0;

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setSize(null);
    setImageError({});
  };

  const checkItemInCart = (productId) => {
    const items = cartItems?.items || [];
    return items.some((item) => item._id === productId);
  };

  const handleAddReview = () => {
    if (rating === 0) {
      toast("Please provide a star rating.", { icon: "❌", duration: 2000, position: "top-center" });
      return;
    }
    dispatch(
      addProductReview({
        productId: productDetails._id,
        userId: user.id,
        userName: user.username,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload && data.payload.success) {
        dispatch(getProductReviews(productDetails._id));
        toast("Review added successfully!", { icon: "✅", duration: 2000, position: "top-center" });
        setRating(0);
        setReviewMsg("");
      } else {
        toast("You either haven't purchased or already reviewed this product.", {
          icon: "❌",
          duration: 3000,
          position: "top-center",
        });
      }
    });
  };

  // Get selected size quantity
  const getSelectedSizeQuantity = () => {
    if (!size || size === "-") return 0;
    const selectedSizeObj = availableSizes.find(s => s.size === size);
    return selectedSizeObj ? selectedSizeObj.quantity : 0;
  };

  // Placeholder component for when no images are available
  const ImagePlaceholder = () => (
    <div className="w-full h-64 md:h-96 bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-center text-gray-400">
        <ImageIcon size={48} className="mx-auto mb-2 md:w-16 md:h-16" />
        <p className="text-sm md:text-base">No image available</p>
      </div>
    </div>
  );

  // Component to display current image with error handling
  const ImageDisplay = () => {
    if (!hasValidImages) {
      return <ImagePlaceholder />;
    }

    const currentImage = images[slideIdx];
    const hasError = imageError[slideIdx];

    if (hasError || !currentImage) {
      return <ImagePlaceholder />;
    }

    return (
      <div className="w-full h-76 md:h-full overflow-hidden rounded-lg">
        <img
          src={currentImage}
          alt={`${productDetails?.title} - Image ${slideIdx + 1}`}
          className="w-full h-full object-cover object-top"
          onError={() => handleImageError(slideIdx)}
          onLoad={() => setImageError(prev => ({ ...prev, [slideIdx]: false }))}
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-gray-100 p-4 md:p-6 min-w-[70vw] max-h-[95vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-lg overflow-hidden shadow-lg"
          >
            <ImageDisplay />
            
            {hasValidImages && images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-1.5 md:p-2 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} className="md:w-5 md:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-1.5 md:p-2 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} className="md:w-5 md:h-5" />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSlideIdx(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === slideIdx ? 'bg-white' : 'bg-gray-400'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Product Details Section */}
          <div className="flex flex-col gap-3 md:gap-4">
            <DialogTitle className="text-xl md:text-3xl font-bold leading-tight">
              {productDetails?.title || 'Untitled Product'}
            </DialogTitle>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 text-sm md:text-base text-gray-400">
              <span><strong>Category:</strong> {productDetails?.category || 'N/A'}</span>
              <span><strong>Brand:</strong> {productDetails?.brand || 'N/A'}</span>
            </div>

            <div className="flex items-baseline gap-2">
              {productDetails?.sellPrice > 0 && (
                <span className="text-green-400 font-bold text-lg md:text-xl">
                  ₹{productDetails.sellPrice}.00
                </span>
              )}
              <span
                className={`${
                  productDetails?.sellPrice > 0 ? "line-through text-gray-500" : ""
                } text-base md:text-lg`}
              >
                ₹{productDetails?.price || 0}.00
              </span>
            </div>

            {/* Description moved below price with highlighted background */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-3 md:p-4 rounded-lg border border-blue-800/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
                <span className="text-blue-300 font-medium text-sm md:text-base">Description</span>
              </div>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                {productDetails?.description || 'No description available'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StarRatingComponent rating={averageRating} />
              <span className="text-yellow-300 text-sm md:text-base">
                {averageRating.toFixed(1)} ({productReviews?.length || 0} reviews)
              </span>
            </div>

            {/* Sizes Section */}
            <div className="space-y-3">
              {hasSizes ? (
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm md:text-base">Available Sizes:</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableSizes.map(({ size: sizeOption, quantity }) => (
                      <motion.button
                        key={sizeOption}
                        onClick={() => setSize(sizeOption)}
                        className={`p-2 md:p-3 rounded-lg border-2 transition-all duration-200 ${
                          size === sizeOption
                            ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                            : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-sm md:text-base">{sizeOption}</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Package className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            <span className="text-xs text-gray-400">{quantity}</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {size && size !== "-" && (
                    <div className="p-2 md:p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-300">
                        Selected size: <span className="font-semibold text-white">{size}</span>
                        <span className="text-gray-400 ml-2">({getSelectedSizeQuantity()} available)</span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 flex items-center gap-2 text-sm md:text-base">
                  <Package className="w-4 h-4" />
                  <span>Size: Not applicable</span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="mt-2">
              {!productDetails?.quantity || productDetails.quantity === 0 ? (
                <Button disabled className="w-full opacity-50 cursor-not-allowed h-10 md:h-12 text-sm md:text-base">
                  Out of Stock
                </Button>
              ) : hasSizes && (!size || size === "-") ? (
                <Button disabled className="w-full opacity-50 cursor-not-allowed h-10 md:h-12 text-sm md:text-base">
                  Please select a size
                </Button>
              ) : hasSizes && getSelectedSizeQuantity() === 0 ? (
                <Button disabled className="w-full opacity-50 cursor-not-allowed h-10 md:h-12 text-sm md:text-base">
                  Selected size out of stock
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddToCart(productDetails._id, hasSizes ? getSelectedSizeQuantity() : productDetails.quantity, size)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 h-10 md:h-12 text-sm md:text-base"
                  disabled={!productDetails._id}
                >
                  <ShoppingCart size={16} className="md:w-5 md:h-5" />
                  {checkItemInCart(productDetails._id) ? "Added to Cart" : "Add to Cart"}
                </Button>
              )}
            </div>

            <Separator className="bg-gray-600 my-2" />

            {/* Reviews Section */}
            <div>
              <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">Customer Reviews</h2>
              <div className="max-h-40 md:max-h-48 overflow-auto space-y-3 md:space-y-4">
                {productReviews && productReviews.length > 0 ? (
                  productReviews.map((review, idx) => (
                    <div key={idx} className="flex gap-2 md:gap-3 pb-2 md:pb-3 border-b border-gray-600 last:border-b-0">
                      <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                        <AvatarFallback className="text-gray-700 font-extrabold text-sm md:text-xl bg-gray-300">
                          {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold capitalize text-sm md:text-base truncate">
                            {review.userName || 'Anonymous'}
                          </h3>
                          <span className="text-xs md:text-sm text-gray-400 flex-shrink-0 ml-2">
                            {review.updatedAt ? new Date(review.updatedAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="scale-75 md:scale-100 origin-left">
                          <StarRatingComponent rating={review.reviewValue || 0} />
                        </div>
                        {review.reviewMessage && (
                          <div className="mt-1 md:mt-2">
                            <MessageSquareMore className="w-3 h-3 md:w-4 md:h-4 text-gray-400 inline mr-1" />
                            <p className="text-gray-300 inline text-xs md:text-sm">{review.reviewMessage}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm md:text-base">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>

              {/* Add Review Section */}
              {user && (
                <div className="mt-4 md:mt-6 space-y-3 p-3 md:p-4 bg-gray-700 rounded-lg">
                  <Label className="text-white font-semibold text-sm md:text-base">Write a Review</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm text-gray-300">Rating:</span>
                    <div className="scale-75 md:scale-100 origin-left">
                      <StarRatingComponent rating={rating} handleRatingChange={(r) => setRating(r)} />
                    </div>
                  </div>
                  <Input
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="bg-gray-600 border-gray-500 text-sm md:text-base"
                  />
                  <Button 
                    onClick={handleAddReview} 
                    disabled={!reviewMsg.trim() || rating === 0}
                    className="w-full bg-green-600 hover:bg-green-700 h-9 md:h-10 text-sm md:text-base"
                  >
                    Submit Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;