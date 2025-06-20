import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ShoppingCart, Tag } from "lucide-react";

const ShoppingProductTile = ({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) => {
  return (
    <Card className="py-0 w-full max-w-sm mx-auto bg-gray-800 text-gray-200 border-1 border-gray-700 shadow-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative h-[300px] overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
          />
          {product.quantity === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-400 text-gray-900 font-bold px-2 py-1 text-xs tracking-wider">
              Out of Stock
              <Tag />
            </Badge>
          ) : product.quantity < 10 ? (
            <Badge className="absolute top-2 left-2 bg-amber-300 text-gray-900 font-bold px-2 py-1 text-xs tracking-wider">
              {`${product.quantity} Left`}
              <Tag />
            </Badge>
          ) : (
            <Badge className="absolute top-2 left-2 bg-green-500 text-gray-900 font-bold px-2 py-1 text-xs tracking-wider">
              Sale
              <Tag />
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 capitalize truncate">
            {product?.title}
          </h2>
          <div className="flex items-center gap-1 text-gray-400 mb-2">
            <span className="text-sm capitalize">{product?.category}</span>
            ||
            <span className="text-sm capitalize">{product?.brand}</span>
          </div>
          <div className="flex gap-2">
            {product?.sellPrice > 0 && (
              <span className={`text-lg font-bold text-green-400`}>
                ₹{product?.sellPrice}.00
              </span>
            )}
            <span
              className={`text-lg text-gray-400 ${
                product?.sellPrice > 0 && "line-through text-muted-foreground"
              }`}
            >
              ₹{product?.price}.00
            </span>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        {product?.quantity === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2">
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddToCart(product?._id, product?.quantity)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
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
