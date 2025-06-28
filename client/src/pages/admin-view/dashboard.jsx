import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductImageUpload from "@/components/admin-view/image-upload"; // single
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImages, getFeatureImages } from "@/store/common/image-upload-slice";
import { Image } from "lucide-react";

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setImageUploadedUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImageList } = useSelector((s) => s.commonFeatureImage);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getFeatureImages()); }, [dispatch]);

  const handleUpload = () => {
    if (!uploadedImageUrl) return;
    dispatch(addFeatureImages(uploadedImageUrl)).then((r)=>{
      if (r.payload.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setImageUploadedUrl("");
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-4">
      <ProductImageUpload
        mode="dark"
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setImageUploadedUrl={setImageUploadedUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        currentEditedId={null}
        widhtCustomize={true}
      />
      <Button onClick={handleUpload} className="w-full mt-4 bg-gray-600 hover:bg-gray-500">Upload</Button>
      <div className="flex items-center justify-center mt-5 gap-2">
        <h1 className="text-3xl text-orange-200">All Banner Images</h1>
        <Image className="w-7 h-7 text-gray-300"/>
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {featureImageList.length > 0 ? featureImageList.map((f,i)=>(
          <img key={i} src={f.image} className="w-full h-auto rounded-2xl"/>
        )) : <h1 className="text-center">No Banner Images yet uploaded</h1>}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
