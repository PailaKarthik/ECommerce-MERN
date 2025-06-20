import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Heading1, ShoppingCart, Star } from "lucide-react";
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
import { MessageSquareMore } from "lucide-react";

const ProductDetailsDailog = ({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
}) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { productReviews } = useSelector((state) => state.shoppingReview);
  const dispatch = useDispatch();

  const handleRatingChange = (getRating) => {
    setRating(getRating);
  };

  const checkItemInCart = (productId) => {
    let getCartItems = cartItems.items || [];
    return getCartItems.some((item) => item._id === productId);
  };

  const handleDailogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  };

  const handleAddReview = () => {
    if (rating === 0) {
      toast("give rating in starts", {
        icon: "❌",
        duration: 2000,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      return;
    }

    dispatch(
      addProductReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.username,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getProductReviews(productDetails?._id));
        toast("Review added successfully!", {
          icon: "❌",
          duration: 2000,
          position: "top-center",
          style: {
            backgroundColor: "black",
            color: "white",
          },
        });
        setRating(0);
        setReviewMsg("");
      } else {
        console.log(data?.payload);
        toast("You either not bought or already reviewed this product", {
          icon: "❌",
          duration: 3000,
          position: "top-center",
          style: {
            backgroundColor: "black",
            color: "white",
          },
        });
      }
    });
  };

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getProductReviews(productDetails?._id));
    }
  }, [productDetails, dispatch]);

  const averageRating =
    productReviews && productReviews.length > 0
      ? productReviews.reduce(
          (sum, reviewItem) => sum + reviewItem.reviewValue,
          0
        ) / productReviews.length
      : 0;

  console.log("reviews", productReviews);

  return (
    <Dialog open={open} onOpenChange={handleDailogClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-gray-100 grid md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto ">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-lg shadow-lg"
        >
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover object-top"
          />
        </motion.div>
        <div className="flex flex-col gap-3 justify-center">
          <div>
            <DialogTitle className="text-3xl font-extrabold">
              {productDetails?.title}
            </DialogTitle>
            <p className="text-gray-400 text-sm mt-2">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <span className="text-sm capitalize">
              <span className="text-gray-300 font-semibold">Category :</span>{" "}
              {productDetails?.category}
            </span>
            <span className="text-sm capitalize">
              <span className="text-gray-300 font-semibold">Brand :</span>
              {productDetails?.brand}
            </span>
          </div>

          <div className="flex gap-2 mb-2">
            {productDetails?.sellPrice > 0 && (
              <span className={`text-lg font-bold text-green-400`}>
                ₹{productDetails?.sellPrice}.00
              </span>
            )}
            <span
              className={`text-lg text-gray-400 ${
                productDetails?.sellPrice > 0 &&
                "line-through text-muted-foreground"
              }`}
            >
              ₹{productDetails?.price}.00
            </span>
          </div>

          <div className="flex items-center">
            <StarRatingComponent rating={averageRating} />
            <p className="ml-1 text-yellow-300">{averageRating.toFixed(2)}</p>
          </div>

          <div className="mb-4">
            {productDetails?.quantity === 0 ? (
              <Button className="w-full bg-gray-700 opacity-50 cursor-not-allowed hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2">
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddToCart(productDetails?._id, productDetails?.quantity)
                }
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                {checkItemInCart(productDetails?._id)
                  ? "Added to Cart "
                  : "Add to Cart"}
              </Button>
            )}

            <span className="text-gray-600 text-sm">
              {checkItemInCart(productDetails?._id) &&
                "If you click above button still the quantity increase."}
            </span>
          </div>

          <Separator />

          <div>
            <h2 className="font-bold mb-2 text-orange-100 text-lg">Reviews</h2>

            <div className="pr-5 max-h-[200px] overflow-auto flex flex-col gap-6">
              {productReviews && productReviews.length > 0 ? (
                productReviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex gap-3 border-b-1 pb-2 border-gray-600"
                  >
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback className="text-gray-100 font-bold bg-gray-700">
                        {review.userName.toUpperCase()[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold capitalize">
                          {review.userName}
                        </h3>
                        <p className="text-gray-300">
                          {review.updatedAt
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("/")}
                        </p>
                      </div>
                      <div className="flex">
                        <StarRatingComponent rating={review.reviewValue} />
                      </div>
                      <MessageSquareMore className="w-4 h-4 mt-2" />
                      <div className="flex items-center text-gray-400 gap-1">
                        <span>{review.reviewMessage}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-gray-300">No reviews</h1>
              )}
              <Separator />
            </div>
            <div className="mt-5 flex flex-col mb-4 gap-2">
              <Label>Write a Review</Label>
              <div className="flex gap-0.5">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                className="border-gray-500"
                placeholder="write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
                className="bg-gray-700 hover:bg-gray-600 cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDailog;
