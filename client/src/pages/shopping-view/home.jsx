import React, { useEffect, useState } from "react";
import Banner1 from "../../assets/banner-1.webp";
import Banner2 from "../../assets/banner-2.webp";
import Banner3 from "../../assets/banner-3.webp";
import { Button } from "../../components/ui/button";
import {
  Baby,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Footprints,
  GaugeIcon,
  Glasses,
  Leaf,
  LeafIcon,
  Mars,
  Plug,
  TreePalmIcon,
  TriangleDashedIcon,
  Venus,
  WandSparklesIcon,
  Component,
  SplitIcon,
  ShoppingBag,
  Feather,
  Tag,
  Fan,
  Shirt,
  Castle,
  LandPlot,
  Star,
  Sun,
  Hexagon,
  Building,
  Puzzle,
  GalleryVerticalEnd,
  Swords,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  setProductDetails, // Import the action to reset product details
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDailog from "@/components/shopping-view/productDetails";
import { useNavigate } from "react-router-dom";
import { getFeatureImages } from "@/store/common/image-upload-slice";

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeatureImage);
  const slides = featureImageList;
  const [openDetailsDailog, setOpenDetailsDailog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const brandsWithIcon = [
    { id: "massey", label: "Massey", icon: ShoppingBag },
    { id: "linonfeel", label: "Linon Feel", icon: Feather },
    { id: "manwill", label: "Manwill", icon: Tag },
    { id: "jockey", label: "Jockey", icon: Fan },
    { id: "siyaram", label: "Siyaram", icon: Shirt },
    { id: "raymond", label: "Raymond", icon: Castle },
    { id: "ramraj", label: "RamRaj", icon: LandPlot },
    { id: "sambodi", label: "Sambodi", icon: Star },
    { id: "murarka", label: "Murarka", icon: Sun },
    { id: "solino", label: "Solino", icon: Hexagon },
    { id: "urbanInspire", label: "Urban Inspire", icon: Building },
  ];

  const categoriesWithIcon = [
    { id: "clothing", label: "Clothing", icon: GalleryVerticalEnd },
    { id: "combo", label: "Combo", icon: Swords },
    { id: "men", label: "Men", icon: Mars },
    { id: "accessories", label: "Accessories", icon: Glasses },
    { id: "electronics", label: "Electronics", icon: Plug },
    { id: "footwear", label: "Footwear", icon: Footprints },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "priceLowToHigh",
      })
    );
  }, [dispatch]);

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleAddToCart = (productId, q, size) => {
    console.log("Add to cart clicked for product ID:", productId, user);
    console.log(q);
    console.log("home-size", size);
    if (size === null) {
      toast(`enter the size of the product`, {
        icon: "❌",
        duration: 2000,
        position: "top-center",
        style: { backgroundColor: "black", color: "white" },
      });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 ,size : size})).then(
      (response) => {
        console.log("Product added to cart:", response);
        if (response.payload?.success) {
          dispatch(fetchCartItems({ userId: user?.id }));
          toast(response?.payload.message, {
            icon: "✅",
            duration: 1000,
            position: "top-center",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });
        }
      }
    );
  };

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDailog(true);
    }
  }, [productDetails]);

  // Reset product details when component unmounts
  useEffect(() => {
    return () => {
      dispatch(setProductDetails()); // Reset product details
    };
  }, [dispatch]);

  const handleNavigateToListingPage = (item, section) => {
    // e.g. section="category", item.id="men"
    const params = new URLSearchParams();
    params.append(section, item.id);
    navigate(`/shop/listing?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0.5, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col min-h-screen p-4 md:p-8  lg:p-16 bg-gray-900 gap-10 "
    >
      <div className="relative w-full h-64 md:h-80 lg:h-[400px] overflow-hidden">
        {slides && slides.length > 0
          ? slides.map((slide, index) => {
              return (
                <img
                  src={slide?.image}
                  key={index}
                  className={`absolute w-full h-full object-cover lg:top-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 transition-opacity duration-1000 rounded-2xl ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              );
            })
          : null}
        {/* Prev button: hidden on small, shown from md upwards */}

        <Button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === 0 ? (slides?.length ? slides.length - 1 : 0) : prev - 1
            )
          }
          variant="outline"
          size="icon"
          className="hidden md:flex absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-gray-200 hover:bg-gray-700"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        {/* Next button: hidden on small, shown from md upwards */}
        <Button
          onClick={() =>
            setCurrentSlide((prev) =>
              slides && slides.length
                ? prev === slides.length - 1
                  ? 0
                  : prev + 1
                : 0
            )
          }
          variant="outline"
          size="icon"
          className="hidden md:flex absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-gray-200 hover:bg-gray-700"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-6  rounded-xl">
        <div className="flex flex-col px-4">
          <h2 className="flex items-center justify-center text-3xl font-bold gap-2 text-gray-200 mb-8">
            <Component />
            Shop by <span className="text-orange-200">Category</span>
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {categoriesWithIcon.map((category) => {
              return (
                <Card
                  onClick={() =>
                    handleNavigateToListingPage(category, "category")
                  }
                  key={category.id}
                  className="bg-gray-900 cursor-pointer hover:shadow-lg transition-shadow shadow-gray-600 border-gray-600"
                >
                  <CardContent className="flex flex-col items-center justify-center bg-gray-900 text-gray-300 hover:scale-90 transition-all duration-200">
                    <category.icon className="w-12 h-12 mb-4" />
                    <span className="font-bold text-sm">{category.label}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-6  rounded-xl">
        <div className="flex flex-col px-4">
          <h2 className="flex items-center justify-center gap-2 text-3xl font-bold text-center text-gray-200 mb-8">
            <SplitIcon />
            Shop by <span className=" text-orange-200">Brand</span>
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brand) => {
              return (
                <Card
                  onClick={() => handleNavigateToListingPage(brand, "brand")}
                  key={brand.id}
                  className="bg-gray-900 cursor-pointer hover:shadow-lg transition-shadow shadow-gray-600 border-gray-600"
                >
                  <CardContent className="flex flex-col items-center justify-center px-6 bg-gray-900 text-gray-300 hover:scale-90 transition-all duration-200">
                    <brand.icon className="w-12 h-12 mb-4" />
                    <span className="font-bold">{brand.label}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-800 rounded-xl">
        <div className="flex flex-col items-center px-4">
          <h2 className="text-3xl font-bold text-center text-orange-100 mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDailog
        handleAddToCart={handleAddToCart}
        open={openDetailsDailog}
        setOpen={setOpenDetailsDailog}
        productDetails={productDetails}
      />
    </motion.div>
  );
};

export default ShoppingHome;
