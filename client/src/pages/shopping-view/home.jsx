import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Footprints,
  Glasses,
  Mars,
  Plug,
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
  GalleryVerticalEnd,
  Swords,
  Truck,
  Headphones,
  Shield,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  TrendingUp,
  Award,
  Gift,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  setProductDetails,
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

  const popularBrands = [
    { id: "jockey", label: "Jockey", icon: Fan },
    { id: "raymond", label: "Raymond", icon: Castle },
    { id: "siyaram", label: "Siyaram", icon: Shirt },
    { id: "massey", label: "Massey", icon: ShoppingBag },
    { id: "urbanInspire", label: "Urban Inspire", icon: Building },
  ];

  const services = [
    {
      icon: Truck,
      title: "24/7 Delivery",
      description: "Fast delivery anytime, anywhere",
    },
    {
      icon: Headphones,
      title: "Online Support",
      description: "24/7 customer support",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
    },
    {
      icon: Clock,
      title: "Quick Service",
      description: "Lightning fast service",
    },
  ];

  const socialIcons = [
    { icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Youtube, href: "#", color: "hover:text-red-500" },
    { icon: MessageCircle, href: "#", color: "hover:text-green-500" },
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
    if (size === null) {
      toast(`enter the size of the product`, {
        icon: "❌",
        duration: 2000,
        position: "top-center",
        style: { backgroundColor: "black", color: "white" },
      });
      return;
    }

    dispatch(
      addToCart({ userId: user?.id, productId, quantity: 1, size: size })
    ).then((response) => {
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
    });
  };

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDailog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    return () => {
      dispatch(setProductDetails());
    };
  }, [dispatch]);

  const handleNavigateToListingPage = (item, section) => {
    const params = new URLSearchParams();
    params.append(section, item.id);
    navigate(`/shop/listing?${params.toString()}`);
  };

  // Get popular products (first 6 products)
  const popularProducts = productList.slice(0, 6);

  // Get latest products (sort by creation date - assuming products have createdAt or _id for sorting)
  // Since newer MongoDB ObjectIds contain timestamp, we can sort by _id in descending order
  const latestProducts = [...productList]
    .sort((a, b) => {
      // If createdAt exists, use it; otherwise use _id for sorting
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      // MongoDB ObjectId contains timestamp, so newer IDs are lexicographically greater
      return b._id.localeCompare(a._id);
    })
    .slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0.5, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col min-h-screen bg-gray-900"
    >
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-80 lg:h-[400px] overflow-hidden mt-4 md:mt-8 lg:mt-16 rounded-xl">
        {slides && slides.length > 0
          ? slides.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`absolute w-full h-full object-cover transition-opacity duration-1000 rounded-xl ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                alt={`Banner ${index + 1}`}
              />
            ))
          : null}

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

      {/* Brands Section */}
      <section className="py-6 mx-4 md:mx-8 lg:mx-16">
        <h2 className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-center text-gray-200 mb-6">
          <SplitIcon />
          Shop by <span className="text-orange-200">Brand</span>
        </h2>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 ">
          {brandsWithIcon.map((brand) => (
            <Card
              onClick={() => handleNavigateToListingPage(brand, "brand")}
              key={brand.id}
              className="bg-gray-800 cursor-pointer hover:shadow-lg transition-all shadow-gray-600 border-gray-600 hover:scale-105"
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-gray-300">
                <brand.icon className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4" />
                <span className="font-bold text-xs md:text-sm text-center">
                  {brand.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2" style={{ width: "max-content" }}>
            {brandsWithIcon.map((brand) => (
              <Card
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                key={brand.id}
                className="bg-gray-800 cursor-pointer hover:shadow-lg transition-all shadow-gray-600 border-gray-600 flex-shrink-0"
                style={{ minWidth: "80px" }}
              >
                <CardContent className="flex flex-col items-center justify-center p-3 text-gray-300">
                  <brand.icon className="w-6 h-6 mb-2" />
                  <span className="font-bold text-xs text-center whitespace-nowrap">
                    {brand.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 mx-4 md:mx-8 lg:mx-16">
        <h2 className="flex items-center justify-center text-2xl md:text-3xl font-bold gap-2 text-gray-200 mb-6">
          <Component />
          Shop by <span className="text-orange-200">Category</span>
        </h2>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoriesWithIcon.map((category) => (
            <Card
              onClick={() => handleNavigateToListingPage(category, "category")}
              key={category.id}
              className="bg-gray-800 cursor-pointer hover:shadow-lg transition-all shadow-gray-600 border-gray-600 hover:scale-105"
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-gray-300">
                <category.icon className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4" />
                <span className="font-bold text-xs md:text-sm text-center">
                  {category.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2" style={{ width: "max-content" }}>
            {categoriesWithIcon.map((category) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(category, "category")
                }
                key={category.id}
                className="bg-gray-800 cursor-pointer hover:shadow-lg transition-all shadow-gray-600 border-gray-600 flex-shrink-0"
                style={{ minWidth: "80px" }}
              >
                <CardContent className="flex flex-col items-center justify-center p-3 text-gray-300">
                  <category.icon className="w-6 h-6 mb-2" />
                  <span className="font-bold text-xs text-center whitespace-nowrap">
                    {category.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="py-6 mx-4 md:mx-8 lg:mx-16">
        <h2 className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-center text-gray-200 mb-6">
          <Award />
          Popular <span className="text-orange-200">Brands</span>
        </h2>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularBrands.map((brand) => (
            <Card
              onClick={() => handleNavigateToListingPage(brand, "brand")}
              key={brand.id}
              className="bg-gray-800 cursor-pointer hover:shadow-lg transition-all shadow-gray-600 border-gray-600 hover:scale-105"
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-gray-300">
                <brand.icon className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4" />
                <span className="font-bold text-xs md:text-sm text-center">
                  {brand.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2" style={{ width: "max-content" }}>
            {popularBrands.map((brand) => (
              <Card
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                key={brand.id}
                className="bg-gray-800 cursor-pointer hover:shadow-lg transition-all shadow-gray-600 border-gray-600 flex-shrink-0"
                style={{ minWidth: "90px" }}
              >
                <CardContent className="flex flex-col items-center justify-center p-3 text-gray-300">
                  <brand.icon className="w-6 h-6 mb-2" />
                  <span className="font-bold text-xs text-center whitespace-nowrap">
                    {brand.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 mx-4 md:mx-8 lg:mx-16 bg-gray-800 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div key={index} className="text-center">
              <service.icon className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 text-orange-400" />
              <h3 className="font-bold text-white text-sm md:text-base mb-1 md:mb-2">
                {service.title}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-6 p-2 mt-2 md:mt-4 md:py-12 mx-4 md:mx-8 lg:mx-16 bg-gray-800 rounded-xl">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-orange-100 mb-6">
          <Sparkles /> Latest Products
        </h2>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestProducts.map((p) => (
            <ShoppingProductTile
              key={p._id}
              product={p}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Mobile: two per view horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {latestProducts.map((p) => (
              <div key={p._id} className="flex-shrink-0 min-w-[50vw] px-2">
                <ShoppingProductTile
                  product={p}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                  isMobile
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-6 md:py-12 mx-4 md:mx-8 lg:mx-16">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-200 mb-6">
          <TrendingUp /> Popular Products
        </h2>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularProducts.map((p) => (
            <ShoppingProductTile
              key={p._id}
              product={p}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Mobile: two per view horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {popularProducts.map((p) => (
              <div key={p._id} className="flex-shrink-0 min-w-[50vw] px-2">
                <ShoppingProductTile
                  product={p}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                  isMobile
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Footer */}
      <section className="py-8 mx-4 md:mx-8 lg:mx-16 mt-8">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-200 mb-6">
            Follow Us
          </h3>
          <div className="flex justify-center gap-6">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`text-gray-400 ${social.color} transition-colors duration-300 hover:scale-110 transform`}
              >
                <social.icon className="w-8 h-8 md:w-10 md:h-10" />
              </a>
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

      <style jsx="true">{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};

export default ShoppingHome;
