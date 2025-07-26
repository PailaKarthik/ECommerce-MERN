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
  TrendingUp,
  Award,
  Sparkles,
  Eye,
  ArrowRight,
  SeparatorHorizontal,
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

//branding images
import Jockey from "../../assets/brands/jockey.webp";
import Massey from "../../assets/brands/massey.jpg";
import Murarka from "../../assets/brands/murarka.jpg";
import Raymond from "../../assets/brands/raymond.jpg";
import Sambodhi from "../../assets/brands/sambodhi.webp";
import Siyarams from "../../assets/brands/siyarams.webp";
import Solino from "../../assets/brands/solino.jpeg";
import LinonFeel from "../../assets/brands/Linon-Feel.jpg";
import Manwill from "../../assets/brands/manwill.webp";
import RamRaj from "../../assets/brands/ramraj.webp";
import UrbanInspire from "../../assets/brands/urban-inspire.jpg";

//category images
import Accessories from "../../assets/categories/accessories.jpg";
import Shirting from "../../assets/categories/shirting.jpeg";
import Pants from "../../assets/categories/pants.webp";
import MenClothing from "../../assets/categories/men-clothing.webp";
import Mattress from "../../assets/categories/mattress.avif";

import { RiShirtLine } from "react-icons/ri";
import { FaMattressPillow } from "react-icons/fa6";
import { PiPantsLight } from "react-icons/pi";

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false); // Add animation control
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeatureImage);
  const slides = featureImageList;
  const [openDetailsDailog, setOpenDetailsDailog] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Move static data outside component or memoize it
  const brandsWithIcon = React.useMemo(
    () => [
      { id: "jockey", label: "Jockey", icon: Fan, image: Jockey },
      { id: "massey", label: "Massey", icon: ShoppingBag, image: Massey },
      { id: "ramraj", label: "RamRaj", icon: LandPlot, image: RamRaj },
      { id: "solino", label: "Solino", icon: Hexagon, image: Solino },
      { id: "raymond", label: "Raymond", icon: Castle, image: Raymond },
      { id: "sambodi", label: "Sambodi", icon: Star, image: Sambodhi },
      { id: "murarka", label: "Murarka", icon: Sun, image: Murarka },
      { id: "siyaram", label: "Siyaram", icon: Shirt, image: Siyarams },
    ],
    []
  );

  const categoriesWithIcon = React.useMemo(
    () => [
      { id: "men-shirts", label: "Men Shirts", icon: Mars, image: MenClothing },
      {
        id: "men-pants",
        label: "Pants",
        icon: PiPantsLight,
        image: Pants,
      },
      { id: "men-shirting", label: "Men Shirting", icon: RiShirtLine, image: Shirting },
      {
        id: "accessories",
        label: "Accessories",
        icon: Glasses,
        image: Accessories,
      },
      {
        id: "mattress",
        label: "Mattress",
        icon: FaMattressPillow,
        image: Mattress,
      },
    ],
    []
  );

  // const popularBrands = React.useMemo(
  //   () => [
  //     { id: "jockey", label: "Jockey", icon: Fan, image: Jockey },
  //     { id: "raymond", label: "Raymond", icon: Castle, image: Raymond },
  //     { id: "siyaram", label: "Siyaram", icon: Shirt, image: Siyarams },
  //     { id: "massey", label: "Massey", icon: ShoppingBag, image: Massey },
  //     { id: "ramraj", label: "RamRaj", icon: LandPlot, image: RamRaj },
  //   ],
  //   []
  // );

  const services = React.useMemo(
    () => [
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
    ],
    []
  );

  // Fix the auto-sliding effect - add proper dependency and safety check
  useEffect(() => {
    if (!slides || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  // Set animation flag after component mounts
  useEffect(() => {
    setHasAnimated(true);
  }, []);

  // Load feature images only once
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // Load products only once
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "priceLowToHigh",
      })
    );
  }, [dispatch]);

  // Memoize product derivations to prevent recalculation
  const trackpantsProducts = React.useMemo(
    () => productList.filter((product) => product.category === "men-trackpants").slice(0, 8),
    [productList]
  );

  const tshirtsProducts = React.useMemo(
    () => productList.filter((product) => product.category === "men-tshirts").slice(0, 8),
    [productList]
  );

  const latestProducts = React.useMemo(
    () =>
      [...productList]
        .sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return b._id.localeCompare(a._id);
        })
        .slice(0, 8),
    [productList]
  );

  const handleGetProductDetails = React.useCallback(
    (productId) => {
      dispatch(fetchProductDetails(productId));
    },
    [dispatch]
  );

  const handleAddToCart = React.useCallback(
    (productId, q, size) => {
      if (size === null) {
        toast(`Enter the size of the product`, {
          icon: "❌",
          duration: 2000,
          position: "top-center",
          style: { backgroundColor: "black", color: "white" },
        });
        return;
      }

      if (!isAuthenticated) {
        toast("Please login to add items to cart", {
          icon: "🔒",
          duration: 2000,
          position: "top-center",
          style: { backgroundColor: "black", color: "white" },
        });
        sessionStorage.setItem(
          "pendingCartItem",
          JSON.stringify({
            productId,
            quantity: q || 1,
            size,
          })
        );
        navigate("/auth/login");
        return;
      }

      dispatch(
        addToCart({ userId: user?.id, productId, quantity: q || 1, size: size })
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
    },
    [dispatch, isAuthenticated, user?.id, navigate]
  );

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

  const handleNavigateToListingPage = React.useCallback(
    (item, section) => {
      const params = new URLSearchParams();
      params.append(section, item.id);
      navigate(`/shop/listing?${params.toString()}`);
    },
    [navigate]
  );

  // Fixed Brand Card Component - Remove motion animations that cause re-renders
  const BrandCard = React.memo(({ brand, index }) => (
    <div
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105"
      onClick={() => handleNavigateToListingPage(brand, "brand")}
      style={{
        opacity: hasAnimated ? 1 : 0,
        transform: hasAnimated ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.5s ease ${index * 0.1}s`,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={brand.image}
          alt={brand.label}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

        {/* Icon */}
        <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full">
          <brand.icon className="w-5 h-5 text-orange-400" />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 text-gray-900 border-none hover:bg-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 font-semibold"
          >
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-center text-sm md:text-base group-hover:text-orange-400 transition-colors duration-300">
          {brand.label}
        </h3>
        <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-orange-400 text-xs font-medium">
            Explore Collection
          </span>
          <ArrowRight className="w-3 h-3 ml-1 text-orange-400" />
        </div>
      </div>
    </div>
  ));

  // Fixed Category Card Component - Remove motion animations that cause re-renders
  const CategoryCard = React.memo(({ category, index }) => (
    <div
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105"
      onClick={() => handleNavigateToListingPage(category, "category")}
      style={{
        opacity: hasAnimated ? 1 : 0,
        transform: hasAnimated ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.5s ease ${index * 0.1}s`,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={category.image}
          alt={category.label}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

        {/* Icon */}
        <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full">
          <category.icon className="w-5 h-5 text-orange-400" />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 text-gray-900 border-none hover:bg-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 font-semibold"
          >
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-center text-sm md:text-base group-hover:text-orange-400 transition-colors duration-300">
          {category.label}
        </h3>
        <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-orange-400 text-xs font-medium">Shop Now</span>
          <ArrowRight className="w-3 h-3 ml-1 text-orange-400" />
        </div>
      </div>
    </div>
  ));

  return (
    <motion.div
      initial={{ opacity: 0.5, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="p-3 md:p-0 flex flex-col min-h-screen bg-gray-900"
    >
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-80 lg:h-[600px] overflow-hidden ">
        {slides && slides.length > 0
          ? slides.map((slide, index) => (
              <a href="listing">
                <img
                  src={slide?.image}
                  key={index}
                  className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                  alt={`Banner ${index + 1}`}
                />
              </a>
            ))
          : null}

        {slides && slides.length > 1 && (
          <>
            <Button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === 0 ? slides.length - 1 : prev - 1
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
                  prev === slides.length - 1 ? 0 : prev + 1
                )
              }
              variant="outline"
              size="icon"
              className="hidden md:flex absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-gray-200 hover:bg-gray-700"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Latest Products */}
      <section className="lg:px-40 py-6 md:py-12 md:mx-8 lg:mx-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">
            Latest Products
          </h2>
        </div>

        <div className="hidden md:grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
          {latestProducts.map((p) => (
            <ShoppingProductTile
              key={p._id}
              product={p}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>

        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div
            className="flex gap-2 pb-2 justify-center"
            style={{ width: "max-content" }}
          >
            {latestProducts.map((p) => (
              <div key={p._id} className="flex-shrink-0 min-w-[36vw]">
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

      {/* Trackpants Products */}
      <section className="lg:px-40 py-6 md:py-12 md:mx-8 lg:mx-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">
            Men's Trackpants
          </h2>
        </div>

        <div className="hidden md:grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {trackpantsProducts.map((p) => (
            <ShoppingProductTile
              key={p._id}
              product={p}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>

        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2" style={{ width: "max-content" }}>
            {trackpantsProducts.map((p) => (
              <div key={p._id} className="flex-shrink-0 min-w-[36vw]">
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

      {/* T-shirts Products - Mobile Only */}
      <section className="md:hidden py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-2">
            Men's T-shirts
          </h2>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2" style={{ width: "max-content" }}>
            {tshirtsProducts.map((p) => (
              <div key={p._id} className="flex-shrink-0 min-w-[36vw]">
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

      {/* Categories Section */}
      <section className="pt-12 mx-4 md:mx-8 lg:mx-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold text-gray-200 mb-4">
            <Component className="text-orange-400" />
            Shop by <span className="text-orange-400">Category</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our diverse range of categories
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categoriesWithIcon.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
              {categoriesWithIcon.map((category, index) => (
                <div key={category.id} className="w-48 flex-shrink-0">
                  <CategoryCard category={category} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="lg:px-40 pt-12 mx-4 md:mx-8 lg:mx-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold text-gray-200 mb-4">
            <SplitIcon className="text-orange-400" />
            Shop by <span className="text-orange-400">Brand</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover premium collections from your favorite brands
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {brandsWithIcon.map((brand, index) => (
            <BrandCard key={brand.id} brand={brand} index={index} />
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
              {brandsWithIcon.map((brand, index) => (
                <div key={brand.id} className="w-48 flex-shrink-0">
                  <BrandCard brand={brand} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 mx-4 md:mx-8 lg:mx-16 ">
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
