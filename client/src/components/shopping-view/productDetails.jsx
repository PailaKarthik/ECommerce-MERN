import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Heading1, ShoppingCart, Star, MessageSquareMore } from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { useSelector, useDispatch } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { toast } from "sonner";
import { addProductReview, getProductReviews } from "@/store/shop/review-slice";

const ProductDetailsDialog = ({ open, setOpen, productDetails, handleAddToCart }) => {
  const [size, setSize] = useState(null);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { productReviews } = useSelector((state) => state.shoppingReview);
  const dispatch = useDispatch();

  // Initialize or reset size when productDetails change
  useEffect(() => {
    if (productDetails) {
      // If both pantSizes and tshirtSizes are unavailable ("-"), set size to "-"
      console.log(productDetails.pantSizes, productDetails.tshirtSizes, "check")
      if (productDetails.pantSizes === "-" && productDetails.tshirtSizes === "-") {
        setSize("-");
      } else {
        // Reset to null so user can enter
        setSize(null);
      }
      // Fetch reviews
      dispatch(getProductReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);

  const handleRatingChange = (getRating) => {
    setRating(getRating);
  };

  const checkItemInCart = (productId) => {
    const items = cartItems.items || [];
    return items.some((item) => item._id === productId);
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setSize(null);
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
      if (data.payload.success) {
        dispatch(getProductReviews(productDetails._id));
        toast("Review added successfully!", { icon: "✅", duration: 2000, position: "top-center" });
        setRating(0);
        setReviewMsg("");
      } else {
        toast("You either haven't purchased or already reviewed this product.", { icon: "❌", duration: 3000, position: "top-center" });
      }
    });
  };

  // Calculate average rating
  const averageRating =
    productReviews && productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.reviewValue, 0) / productReviews.length
      : 0;

  console.log(size)
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-gray-100 grid md:grid-cols-2 gap-8 p-6 lg:min-w-[70vw] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="rounded-lg overflow-hidden shadow-lg">
          <img src={productDetails?.image} alt={productDetails?.title} className="w-full h-auto object-cover" />
        </motion.div>

        <div className="flex flex-col gap-4">
          <div>
            <DialogTitle className="text-3xl font-bold">{productDetails?.title}</DialogTitle>
            <p className="text-gray-400 mt-2">{productDetails?.description}</p>
          </div>

          <div className="flex gap-4 text-gray-400">
            <span><strong>Category:</strong> {productDetails?.category}</span>
            <span><strong>Brand:</strong> {productDetails?.brand}</span>
          </div>

          <div className="flex items-baseline gap-2">
            {productDetails?.sellPrice > 0 && <span className="text-green-400 font-bold text-xl">₹{productDetails.sellPrice}.00</span>}
            <span className={`${productDetails?.sellPrice > 0 ? 'line-through text-gray-500' : ''} text-lg`}>₹{productDetails?.price}.00</span>
          </div>

          <div className="space-y-4">
            {productDetails?.pantSizes !== "-" && (
              <div className="flex flex-col gap-1">
                <span>Available Pant Sizes : <span className="font-extrabold text-orange-100">{productDetails && productDetails.pantSizes}</span></span>
                <Input
                  type="text"
                  value={size || ''}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Enter size"
                  className="border-gray-500"
                />
              </div>
            )}
            {productDetails?.tshirtSizes !== "-" && (
              <div className="flex flex-col gap-1">
                <span>Available T-Shirt Sizes : <span className="font-extrabold text-orange-100">{productDetails && productDetails.tshirtSizes}</span></span>
                <Input
                  type="text"
                  value={size || ''}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Enter size"
                  className="border-gray-500"
                />
              </div>
            )}
            {productDetails?.pantSizes === "-" && productDetails?.tshirtSizes === "-" && (
              <div className="text-gray-400">Size: -</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <StarRatingComponent rating={averageRating} />
            <span className="text-yellow-300 ml-1">{averageRating.toFixed(2)}</span>
          </div>

          <div>
            {productDetails?.quantity === 0 ? (
              <Button disabled className="w-full opacity-50">Out of Stock</Button>
            ) : (
              <Button
                onClick={() => handleAddToCart(productDetails._id, productDetails.quantity, size)}
                className="w-full flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                {productDetails && checkItemInCart(productDetails._id) ? "Added to Cart" : "Add to Cart"}
              </Button>
            )}
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-bold mb-2">Reviews</h2>
            <div className="max-h-48 overflow-auto space-y-4">
              {productReviews.length > 0 ? (
                productReviews.map((review, idx) => (
                  <div key={idx} className="flex gap-3 pb-2 border-b border-gray-600">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="text-gray-700 font-extrabold text-xl">{review.userName.toUpperCase().charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold capitalize">{review.userName}</h3>
                        <span className="text-sm text-gray-400">
                          {new Date(review.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRatingComponent rating={review.reviewValue} />
                      <MessageSquareMore className="w-4 h-4 mt-2 text-gray-400" />
                      <p className="text-gray-300 mt-1">{review.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Label>Write a Review</Label>
              <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
              <Input
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write your review..."
              />
              <Button onClick={handleAddReview} disabled={!reviewMsg.trim()}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
