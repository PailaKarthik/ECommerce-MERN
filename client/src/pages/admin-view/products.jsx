import React, { useEffect, useState, Fragment, useCallback } from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  CopyPlus,
  Search,
  Package,
  Grid,
  Filter,
  Sparkles,
} from "lucide-react";
import CommonForm from "../../components/common/form";
import { addProductFormElements } from "../../config";
import MultiImageUpload from "@/components/admin-view/multiImageUpload";
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
import { Card, CardContent } from "@/components/ui/card";

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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { searchResults } = useSelector((s) => s.adminSearch);
  const { productList } = useSelector((s) => s.adminProducts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllProducts()).finally(() => setIsInitialized(true));
    const urlKeyword = searchParams.get("keyword") || "";
    setKeyword(urlKeyword);
    if (urlKeyword.trim()) dispatch(getSearchResults(urlKeyword));
    else dispatch(resetSearchResults());
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (editId && productList.length) {
      const prod = productList.find((p) => p._id === editId);
      if (prod) {
        setFormData({
          images: prod.images || [],
          title: prod.title || "",
          description: prod.description || "",
          category: prod.category || "Men",
          brand: prod.brand || "",
          tshirtSizes: prod.tshirtSizes || "",
          pantSizes: prod.pantSizes || "",
          quantity: prod.quantity || 0,
          price: prod.price || 0,
          sellPrice: prod.sellPrice || 0,
        });
        setUrls(prod.images || []);
        setOpen(true);
      }
    }
  }, [editId, productList]);

  useEffect(() => {
    if (!isInitialized) return;
    if (keyword.trim()) {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
    }
  }, [keyword, isInitialized, dispatch, setSearchParams]);

  const list = React.useMemo(() => {
    const base = keyword.trim() ? searchResults : productList;
    // make a shallow copy and reverse it
    return [...base].reverse();
  }, [keyword, searchResults, productList]);

  const resetAll = useCallback(() => {
    setFormData(initialFormData);
    setUrls([]);
    setLoading(false);
    setEditId(null);
    setOpen(false);
  }, []);

  const refreshData = useCallback(async () => {
    await dispatch(fetchAllProducts());
    if (keyword.trim()) await dispatch(getSearchResults(keyword));
  }, [dispatch, keyword]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const payload = { ...formData };
      const action = editId
        ? editProduct({ id: editId, formData: payload })
        : addNewProduct(payload);
      try {
        const res = await dispatch(action);
        if (res.payload?.success !== false) {
          toast.success(editId ? "Updated successfully" : "Added successfully");
          resetAll();
          await refreshData();
        } else toast.error("Failed to save product");
      } catch {
        toast.error("Error saving product");
      }
    },
    [formData, editId, dispatch, resetAll, refreshData]
  );

  const handleDeleteProduct = useCallback(
    async (id) => {
      const res = await dispatch(deleteProduct(id));
      if (res.payload?.success !== false) {
        toast.success("Deleted successfully");
        await refreshData();
      } else toast.error("Delete failed");
    },
    [dispatch, refreshData]
  );

  if (!isInitialized)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 p-4 md:p-6"
      >
        <Fragment>
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Product Management
              </h1>
              <p className="text-gray-400 text-lg">
                Manage your product inventory with ease
              </p>
            </motion.div>
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Search products by name, category..."
                      className="pl-10 pr-4 py-3 bg-gray-800/50 border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl text-gray-100 placeholder-gray-400"
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                    >
                      <CopyPlus className="w-5 h-5" /> Add New Product
                    </Button>
                  </motion.div>
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <Package className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {list?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">
                      {keyword.trim() ? "Search Results" : "Total Products"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <Grid className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {list ? new Set(list.map((p) => p.category)).size : 0}
                    </p>
                    <p className="text-sm text-gray-400">Categories</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <Filter className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {list ? new Set(list.map((p) => p.brand)).size : 0}
                    </p>
                    <p className="text-sm text-gray-400">Brands</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {list ? list.filter((p) => p.quantity > 0).length : 0}
                    </p>
                    <p className="text-sm text-gray-400">In Stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {!list || list.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 max-w-md mx-auto">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {keyword.trim() ? "No Results Found" : "No Products Yet"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {keyword.trim()
                    ? `No products match "${keyword}". Try different keywords.`
                    : "Start building your product catalog by adding your first product."}
                </p>
                {!keyword.trim() && (
                  <Button
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                  >
                    <CopyPlus className="w-4 h-4" /> Add Your First Product
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6"
            >
              {list.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <AdminProductTile
                    product={product}
                    setFormData={setFormData}
                    setOpenAddProducts={setOpen}
                    setCurrentEditedId={setEditId}
                    handleDeleteProduct={handleDeleteProduct}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          <Sheet open={open} onOpenChange={resetAll}>
            <SheetContent
              side="right"
              className="w-full sm:w-[600px] bg-gray-900 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent border-l border-gray-700"
            >
              <SheetHeader className="pb-6 border-b border-gray-700">
                <SheetTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  {editId ? (
                    <>
                      <Package className="w-6 h-6 text-blue-400" />
                      Edit Product
                    </>
                  ) : (
                    <>
                      <CopyPlus className="w-6 h-6 text-green-400" />
                      Add New Product
                    </>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Product Images
                  </h3>
                  <MultiImageUpload
                    mode="dark"
                    images={formData.images}
                    setImages={(imgs) =>
                      setFormData((f) => ({ ...f, images: imgs }))
                    }
                    uploadedUrls={urls}
                    setUploadedUrls={setUrls}
                    loading={loading}
                    setLoading={setLoading}
                  />
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-400" />
                    Product Details
                  </h3>
                  <CommonForm
                    formControls={addProductFormElements}
                    formData={formData}
                    setFormData={setFormData}
                    ButtonText={editId ? "Update Product" : "Add Product"}
                    onSubmit={onSubmit}
                    mode="dark"
                    isButtonDisabled={!formData.title || loading}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </Fragment>
      </motion.div>
    </div>
  );
};

export default AdminProducts;
