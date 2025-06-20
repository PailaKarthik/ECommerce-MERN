import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { CopyPlus } from "lucide-react";
import { Fragment } from "react";
import CommonForm from "../../components/common/form";
import { addProductFormElements } from "../../config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} from "@/store/admin/products-slice";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";
import { motion } from "framer-motion";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "Men",
  brand: "",
  quantity: 0,
  price: 0,
  sellPrice: 0,
};

const AdminProducts = () => {
  const [openAddProducts, setOpenAddProducts] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setImageUploadedUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();
    // Add product logic here
    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData })).then(
        (response) => {
          console.log("Product edited:", response);
          toast(response?.payload?.message, {
            icon: "✅",
            duration: 3000,
            position: "top-center",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenAddProducts(false);
          setCurrentEditedId(null);
        }
      );
    } else {
      dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then(
        (response) => {
          console.log("Product added:", response);
          toast(response?.payload?.message, {
            icon: "✅",
            duration: 3000,
            position: "top-center",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setImageFile(null);
          setImageUploadedUrl("");
          setOpenAddProducts(false);
        }
      );
    }
  }

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id)).then((response) => {
      console.log("Product deleted:", response);
      toast(response?.payload?.message, {
        icon: "✅",
        duration: 3000,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      dispatch(fetchAllProducts());
    });
  };

  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((value) => value);
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  console.log("Product List:", productList);

  return (
    <motion.div
    initial = {{opacity : 20, y:-20}}
    animate = {{opacity : 100 , y:0}}
    transition={{duration:0.6}}
    >
      <Fragment>
        <div className="mb-5 w-full flex justify-end">
          <Button
            onClick={() => setOpenAddProducts(true)}
            className="shadow-xl rounded-lg bg-gray-800 hover:bg-gray-900"
          >
            <CopyPlus />
            Add New Product
          </Button>
        </div>
        <div className="grid gap-4 grid-cols md:grid-cols-3 lg:grid-cols-4">
          {productList &&
            productList?.map((product) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenAddProducts={setOpenAddProducts}
                setCurrentEditedId={setCurrentEditedId}
                handleDeleteProduct={handleDeleteProduct}
                key={product._id}
                product={product}
              />
            ))}
        </div>
        <Sheet
          open={openAddProducts}
          onOpenChange={() => {
            setOpenAddProducts(false);
            setCurrentEditedId(null);
            setFormData(initialFormData);
          }}
        >
          <SheetContent
            side="right"
            className="w-full overflow-auto bg-gray-800 border-0"
          >
            <SheetHeader>
              <SheetTitle className="font-bold text-lg text-white">
                {currentEditedId ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>

            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setImageUploadedUrl={setImageUploadedUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              currentEditedId={currentEditedId}
              mode="dark"
            />
            <div>
              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                ButtonText={currentEditedId !== null ? "Edit" : "Add"}
                onSubmit={onSubmit}
                mode="dark"
                isButtonDisabled={!isFormValid()}
              />
            </div>
          </SheetContent>
        </Sheet>
      </Fragment>
    </motion.div>
  );
};

export default AdminProducts;
