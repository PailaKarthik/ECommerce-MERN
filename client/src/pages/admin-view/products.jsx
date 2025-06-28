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
import MultiImageUpload from "@/components/admin-view/MultiImageUpload";
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
  images: [],
  title: "",
  description: "",
  category: "Men",
  brand: "",
  tshirtSizes: "",
  pantSizes: "",
  quantity: 0,
  price: 0,
  sellPrice: 0,
};

const AdminProducts = () => {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((s) => s.adminSearch);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const { productList } = useSelector((s) => s.adminProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (keyword.trim()) {
      const t = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
      return () => clearTimeout(t);
    } else {
      dispatch(resetSearchResults());
      setSearchParams(new URLSearchParams());
    }
  }, [keyword, dispatch, setSearchParams]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (editId) {
      // Ensure we have proper image data for editing
      const imageUrls = formData.images || [];
      setUrls(imageUrls);
    }
  }, [editId, formData.images]);

  const list = keyword.trim() ? searchResults : productList;

  const resetAll = () => {
    dispatch(fetchAllProducts());
    setFormData(initialFormData);
    setUrls([]);
    setLoading(false);
    setEditId(null);
    setOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Validate that we have at least one image
    if (!urls || urls.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const payload = { ...formData, images: urls };
    const action = editId
      ? editProduct({ id: editId, formData: payload })
      : addNewProduct(payload);
    
    dispatch(action).then((response) => {
      if (response.payload && response.payload.success !== false) {
        toast.success(editId ? "Product updated successfully" : "Product added successfully");
        resetAll();
      } else {
        toast.error("Failed to save product");
      }
    }).catch((error) => {
      toast.error("An error occurred while saving the product");
      console.error("Product save error:", error);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Fragment>
        <div className="mb-5 flex justify-between items-center">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6 border-gray-400 w-100"
            placeholder="Search Products..."
          />
          <Button
            onClick={() => setOpen(true)}
            className="shadow-xl rounded-lg bg-gray-800 hover:bg-gray-900"
          >
            <CopyPlus /> Add New Product
          </Button>
        </div>

        {keyword.trim() && list.length === 0 ? (
          <p className="text-center text-gray-500">
            No results for "{keyword}"
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {list && list.length > 0 ? (
              list.map((p) => (
                <AdminProductTile
                  key={p._id}
                  product={p}
                  setFormData={setFormData}
                  setOpenAddProducts={setOpen}
                  setCurrentEditedId={setEditId}
                  handleDeleteProduct={(id) => {
                    dispatch(deleteProduct(id)).then((response) => {
                      if (response.payload && response.payload.success !== false) {
                        toast.success("Product deleted successfully");
                        dispatch(fetchAllProducts());
                      } else {
                        toast.error("Failed to delete product");
                      }
                    });
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No products found
              </div>
            )}
          </div>
        )}

        <Sheet open={open} onOpenChange={resetAll}>
          <SheetContent
            side="right"
            className="w-full overflow-auto bg-gray-800 border-0"
          >
            <SheetHeader>
              <SheetTitle className="font-bold text-lg text-white">
                {editId ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>

            <MultiImageUpload
              mode="dark"
              images={formData.images || []}
              setImages={(imgs) => setFormData((f) => ({ ...f, images: imgs }))}
              uploadedUrls={urls}
              setUploadedUrls={setUrls}
              loading={loading}
              setLoading={setLoading}
              currentEditedId={editId}
            />

            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              ButtonText={editId ? "Edit" : "Add"}
              onSubmit={onSubmit}
              mode="dark"
              isButtonDisabled={
                !formData.title ||
                !formData.description ||
                !formData.category ||
                urls.length === 0 ||
                loading
              }
            />
          </SheetContent>
        </Sheet>
      </Fragment>
    </motion.div>
  );
};

export default AdminProducts;