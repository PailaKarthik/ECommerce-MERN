import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeatureImages,
  getFeatureImages,
} from "@/store/common/image-upload-slice";
import { Image } from "lucide-react";

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setImageUploadedUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImageList } = useSelector((state) => state.commonFeatureImage);
  const dispatch = useDispatch();

  const handleUploadFeatureImage = () => {
    if (uploadedImageUrl === "") {
      return;
    }
    dispatch(addFeatureImages(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setImageUploadedUrl("");
      }
    });
  };

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  console.log("uploadedImageUrl", uploadedImageUrl);
  return (
    <motion.div
      initial={{ opacity: 20, y: -20 }}
      animate={{ opacity: 100, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-4"
    >
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setImageUploadedUrl={setImageUploadedUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        currentEditedId={null}
        mode="dark"
        widhtCustomize={true}
      />
      <Button
        onClick={handleUploadFeatureImage}
        className="w-full mt-4 bg-gray-600 hover:bg-gray-500"
      >
        Upload
      </Button>
      <div className="flex items-center justify-center mt-5 gap-2">
        <h1 className="text-3xl text-orange-200 ">All Banner Images</h1>
        <Image className="w-7 h-7 text-gray-300" />
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImageItem) => (
            <div>
              <img
                src={featureImageItem.image}
                alt=""
                className="w-full h-full rounded-2xl "
              />
            </div>
          ))
        ) : (
          <h1 className="text-center">No Banner Images yet uploaded</h1>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
