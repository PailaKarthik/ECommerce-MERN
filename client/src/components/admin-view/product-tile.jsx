import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

const AdminProductTile = ({
  product,
  setFormData,
  setOpenAddProducts,
  setCurrentEditedId,
  handleDeleteProduct
}) => {

  const handleEditButton = () => {
    setCurrentEditedId(product._id);
    setOpenAddProducts(true);
    setFormData({...product });
  };

  return (
    <Card className="w-full pt-0 max-w-sm mx-auto bg-gray-800 text-gray-200 border-0 shadow-lg ">
      <div>
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-cover object-top rounded-t-lg"
          />
        </div>
        <CardContent className="text-center">
          <h2 className="text-xl font-semibold mb-2 capitalize">{product?.title}</h2>
          <div className="flex justify-center items-center mb-2 gap-2">
            {product?.sellPrice > 0 && (
              <span className="text-lg font-bold">
                ₹ {product?.sellPrice}.00
              </span>
            )}
            <span
              className={`${
                product.sellPrice > 0 && "line-through text-muted-foreground"
              } text-lg font-semibold `}
            >
              ₹ {product?.price}.00
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-center items-center">
          <Button onClick={handleEditButton} className="text-green-400">Edit</Button>
          <Button onClick={() => {handleDeleteProduct(product._id)}} className="text-red-300">Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default AdminProductTile;
