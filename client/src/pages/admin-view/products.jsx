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
      }, 500);
      return () => clearTimeout(t);
    } else {
      dispatch(resetSearchResults());
      setSearchParams(new URLSearchParams());
    }
  }, [keyword, dispatch, setSearchParams]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

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
    if (!urls.length) {
      return toast.error("Please upload at least one image");
    }
    const payload = { ...formData, images: urls };
    const action = editId
      ? editProduct({ id: editId, formData: payload })
      : addNewProduct(payload);

    dispatch(action)
      .then((res) => {
        if (res.payload?.success !== false) {
          toast.success(editId ? "Updated successfully" : "Added successfully");
          resetAll();
        } else {
          toast.error("Failed to save product");
        }
      })
      .catch(() => toast.error("Error saving product"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Fragment>
        {/* Header: search + add button */}
        <div className="mb-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Products..."
            className="w-full sm:w-1/2"
          />
          <Button
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto shadow-xl rounded-lg bg-gray-800 hover:bg-gray-900 flex items-center justify-center"
          >
            <CopyPlus className="mr-2" /> Add New Product
          </Button>
        </div>

        {/* Products Grid */}
        {list.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {keyword.trim() ? `No results for "${keyword}"` : "No products found"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map((p) => (
              <AdminProductTile
                key={p._id}
                product={p}
                setFormData={setFormData}
                setOpenAddProducts={setOpen}
                setCurrentEditedId={setEditId}
                handleDeleteProduct={(id) =>
                  dispatch(deleteProduct(id)).then((res) => {
                    if (res.payload?.success !== false) {
                      toast.success("Deleted successfully");
                      dispatch(fetchAllProducts());
                    } else {
                      toast.error("Delete failed");
                    }
                  })
                }
              />
            ))}
          </div>
        )}

        {/* Add/Edit Drawer */}
        <Sheet open={open} onOpenChange={resetAll}>
          <SheetContent side="right" className="w-full sm:w-2/3 md:w-1/2 bg-gray-800">
            <SheetHeader>
              <SheetTitle className="font-bold text-lg text-white">
                {editId ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>

            <MultiImageUpload
              mode="dark"
              images={formData.images}
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
              ButtonText={editId ? "Update" : "Add"}
              onSubmit={onSubmit}
              mode="dark"
              isButtonDisabled={!formData.title || !urls.length || loading}
            />
          </SheetContent>
        </Sheet>
      </Fragment>
    </motion.div>
  );
};

export default AdminProducts;