import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

const StarRatingComponent = ({ rating, handleRatingChange }) => {
  return [1, 2, 3, 4, 5].map((star,index) => (
    <Button key={index}
      onClick={
        handleRatingChange ? () => handleRatingChange(star) : null
      }
      variant="outline"
      className={`text-gray-200 h-0 w-0 border-0 p-0 py-2 bg-gray-800 hover:bg-gray-700 rounded-full`}
    >
      <StarIcon
        className={`w-6 h-6 ${
          star <= rating ? "fill-gray-200 text-gray-200" : ""
        } text-gray-200`}
      />
    </Button>
  ));
};

export default StarRatingComponent;
