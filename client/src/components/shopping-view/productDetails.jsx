import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ShoppingCart, MessageSquareMore, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
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
  const [reviewMsg, setReviewMsg] = useState("");
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
  
  useEffect(() => {
    if (productDetails) {
      setSlideIdx(0);
      setImageError({});
      setSize(
        productDetails.pantSizes === "-" && productDetails.tshirtSizes === "-" 
        ? "-" 
        : null
      );
      dispatch(getProductReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);
  
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

  // Placeholder component for when no images are available
  const ImagePlaceholder = () => (
    <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-center text-gray-400">
        <ImageIcon size={64} className="mx-auto mb-2" />
        <p>No image available</p>
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
      <img
        src={currentImage}
        alt={`${productDetails?.title} - Image ${slideIdx + 1}`}
        className="w-full h-auto object-cover rounded-lg"
        onError={() => handleImageError(slideIdx)}
        onLoad={() => setImageError(prev => ({ ...prev, [slideIdx]: false }))}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-gray-100 grid md:grid-cols-2 gap-8 p-6 lg:min-w-[70vw] max-w-[90vw] max-h-[90vh] overflow-y-auto">
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
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
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

        <div className="flex flex-col gap-4">
          <DialogTitle className="text-3xl font-bold">{productDetails?.title || 'Untitled Product'}</DialogTitle>
          <p className="text-gray-400 mt-2">{productDetails?.description || 'No description available'}</p>

          <div className="flex gap-4 text-gray-400">
            <span><strong>Category:</strong> {productDetails?.category || 'N/A'}</span>
            <span><strong>Brand:</strong> {productDetails?.brand || 'N/A'}</span>
          </div>

          <div className="flex items-baseline gap-2">
            {productDetails?.sellPrice > 0 && (
              <span className="text-green-400 font-bold text-xl">
                ₹{productDetails.sellPrice}.00
              </span>
            )}
            <span
              className={`${
                productDetails?.sellPrice > 0 ? "line-through text-gray-500" : ""
              } text-lg`}
            >
              ₹{productDetails?.price || 0}.00
            </span>
          </div>

          <div className="space-y-4">
            {productDetails?.pantSizes !== "-" && productDetails?.pantSizes && (
              <div className="flex flex-col gap-1">
                <span>
                  Available Pant Sizes :{" "}
                  <span className="font-extrabold text-orange-100">
                    {productDetails.pantSizes}
                  </span>
                </span>
                <Input
                  type="text"
                  value={size || ""}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Enter size"
                  className="border-gray-500 bg-gray-700"
                />
              </div>
            )}
            {productDetails?.tshirtSizes !== "-" && productDetails?.tshirtSizes && (
              <div className="flex flex-col gap-1">
                <span>
                  Available T-Shirt Sizes :{" "}
                  <span className="font-extrabold text-orange-100">
                    {productDetails.tshirtSizes}
                  </span>
                </span>
                <Input
                  type="text"
                  value={size || ""}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Enter size"
                  className="border-gray-500 bg-gray-700"
                />
              </div>
            )}
            {(productDetails?.pantSizes === "-" || !productDetails?.pantSizes) && 
             (productDetails?.tshirtSizes === "-" || !productDetails?.tshirtSizes) && (
              <div className="text-gray-400">Size: Not applicable</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <StarRatingComponent rating={averageRating} />
            <span className="text-yellow-300 ml-1">
              {averageRating.toFixed(1)} ({productReviews?.length || 0} reviews)
            </span>
          </div>

          <div>
            {!productDetails?.quantity || productDetails.quantity === 0 ? (
              <Button disabled className="w-full opacity-50 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={() => handleAddToCart(productDetails._id, productDetails.quantity, size)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                disabled={!productDetails._id}
              >
                <ShoppingCart size={18} />
                {checkItemInCart(productDetails._id) ? "Added to Cart" : "Add to Cart"}
              </Button>
            )}
          </div>

          <Separator className="bg-gray-600" />

          <div>
            <h2 className="text-lg font-bold mb-4">Customer Reviews</h2>
            <div className="max-h-48 overflow-auto space-y-4">
              {productReviews && productReviews.length > 0 ? (
                productReviews.map((review, idx) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-gray-600 last:border-b-0">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="text-gray-700 font-extrabold text-xl bg-gray-300">
                        {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold capitalize">{review.userName || 'Anonymous'}</h3>
                        <span className="text-sm text-gray-400">
                          {review.updatedAt ? new Date(review.updatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <StarRatingComponent rating={review.reviewValue || 0} />
                      {review.reviewMessage && (
                        <div className="mt-2">
                          <MessageSquareMore className="w-4 h-4 text-gray-400 inline mr-1" />
                          <p className="text-gray-300 inline">{review.reviewMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this product!</p>
              )}
            </div>

            {user && (
              <div className="mt-6 space-y-3 p-4 bg-gray-700 rounded-lg">
                <Label className="text-white font-semibold">Write a Review</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Rating:</span>
                  <StarRatingComponent rating={rating} handleRatingChange={(r) => setRating(r)} />
                </div>
                <Input
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="bg-gray-600 border-gray-500"
                />
                <Button 
                  onClick={handleAddReview} 
                  disabled={!reviewMsg.trim() || rating === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Submit Review
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;