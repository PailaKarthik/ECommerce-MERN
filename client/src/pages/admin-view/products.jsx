import React, { useEffect, useState, Fragment } from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { CopyPlus } from "lucide-react";
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
import AdminProductTile from "@/components/admin-view/product-tile";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/admin/search-slice";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "Men",
  brand: "",
  tshirtSizes:"",
  pantSizes : "",
  quantity: 0,
  price: 0,
  sellPrice: 0,
};

const AdminProducts = () => {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.adminSearch);
  const [openAddProducts, setOpenAddProducts] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setImageUploadedUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (keyword.trim() !== "") {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
    }
  }, [keyword, setSearchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const displayList = keyword.trim() !== "" ? searchResults : productList;

  console.log("displaylist",displayList);
  function onSubmit(e) {
    e.preventDefault();
    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData })).then(
        (response) => {
          console.log("responseOfEditproduct",response)
          toast(response?.payload?.message, {
            icon: "✅",
            duration: 3000,
            position: "top-center",
            style: { backgroundColor: "black", color: "white" },
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
          console.log(response)
          toast(response?.payload?.message, {
            icon: "✅",
            duration: 3000,
            position: "top-center",
            style: { backgroundColor: "black", color: "white" },
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
      toast(response?.payload?.message, {
        icon: "✅",
        duration: 3000,
        position: "top-center",
        style: { backgroundColor: "black", color: "white" },
      });
      dispatch(fetchAllProducts());
    });
  };

  const isFormValid = () =>
    Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((value) => value);

  console.log("Product List:", productList);

  return (
    <motion.div
      initial={{ opacity: 20, y: -20 }}
      animate={{ opacity: 100, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Fragment>
        <div className="mb-5 w-full flex justify-between">
          <div className="flex justify-center mb-8">
            <div className="w-full flex items-center">
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="py-6 border-gray-400"
                placeholder="Search Products...."
              />
            </div>
          </div>
          <Button
            onClick={() => setOpenAddProducts(true)}
            className="shadow-xl rounded-lg bg-gray-800 hover:bg-gray-900"
          >
            <CopyPlus />
            Add New Product
          </Button>
        </div>

        {keyword.trim() !== "" && displayList.length === 0 ? (
          <p className="text-center text-gray-500">
            No results found for "{keyword}"
          </p>
        ) : (
          <div className="grid gap-4 grid-cols md:grid-cols-3 lg:grid-cols-4">
            {displayList.map((product) => (
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
        )}

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
