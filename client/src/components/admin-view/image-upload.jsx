import React, { useEffect, useRef, useCallback } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { X, CloudUpload, Loader2 } from "lucide-react";
import axios from "axios";

const ProductImageUpload = ({
  mode,
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setImageUploadedUrl,
  setImageLoadingState,
  imageLoadingState,
  currentEditedId,
  widhtCustomize = false,
}) => {
  const inputRef = useRef(null);

  const handleRemoveUploadedImage = (e) => {
    e.preventDefault();
    setImageFile(null);
    setImageUploadedUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.classList.add("border-dashed-green");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.target.classList.remove("border-dashed-green");
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadImageToCloudinary = useCallback(async () => {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("image", imageFile);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      if (res.data?.success) {
        setImageUploadedUrl(res.data.result.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageLoadingState(false);
    }
  }, [imageFile, setImageUploadedUrl, setImageLoadingState]);

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
  }, [imageFile, uploadImageToCloudinary]);

  return (
    <div className={`w-full ${widhtCustomize ? "" : "max-w-md"} px-4`}>
      <Label
        className={`${
          mode === "dark" ? "text-gray-300" : "text-gray-700"
        } block font-semibold ${widhtCustomize ? "text-xl" : ""}`}
      >
        Upload Image
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex flex-col justify-center items-center border-2 border-gray-500 border-dashed rounded-lg mt-2 cursor-pointer relative gap-2"
        >
          {imageFile ? (
            <div
              className={`relative w-full ${widhtCustomize ? "h-40" : "h-20"}`}
            >
              {imageLoadingState ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-400 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
                </div>
              ) : (
                <div>
                  <img
                    src={uploadedImageUrl}
                    alt="product"
                    className={`w-full h-25 object-center object-cover rounded-lg ${
                      widhtCustomize ? "h-40" : ""
                    }`}
                  />
                  <button
                    onClick={handleRemoveUploadedImage}
                    className="absolute top-2 right-2 bg-gray-600 text-white rounded-full p-1 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`${
                widhtCustomize ? "h-40 flex items-center justify-center " : ""
              }`}
            >
              <Label
                htmlFor="image-upload"
                className={`flex flex-col items-center cursor-pointer p-4 ${
                  currentEditedId !== null && "cursor-not-allowed opacity-40"
                }`}
              >
                <CloudUpload size={24} className="text-muted-foreground" />
                <span className="text-gray-400 text-center mt-2">
                  Drag and Drop OR Click to Upload Image
                </span>
              </Label>
              <Input
                id="image-upload"
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                disabled={currentEditedId !== null}
              />
            </div>
          )}
        </div>
      </Label>
    </div>
  );
};

export default ProductImageUpload;
