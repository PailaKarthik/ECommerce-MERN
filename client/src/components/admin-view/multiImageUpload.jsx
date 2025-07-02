import React, { useEffect, useRef, useCallback, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { X, CloudUpload, Loader2 } from "lucide-react";
import axios from "axios";

const MultiImageUpload = ({
  mode,
  images,
  setImages,
  uploadedUrls,
  setUploadedUrls,
  loading,
  setLoading,
}) => {
  const inputRef = useRef(null);
  const [filesToUpload, setFilesToUpload] = useState([]);

  const handleRemove = (i) => {
    const u = [...uploadedUrls]; u.splice(i,1); setUploadedUrls(u);
    setImages(u);
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setFilesToUpload(filesToUpload.concat(files));
    e.target.value = "";
  };

  const uploadBatch = useCallback(async () => {
    if (filesToUpload.length === 0) return;
    setLoading(true);
    const data = new FormData();
    filesToUpload.forEach(f => data.append("images", f));
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-images`,
        data
      );
      if (res.data?.success) {
        const all = uploadedUrls.concat(res.data.urls);
        setUploadedUrls(all);
        setImages(all);
        setFilesToUpload([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filesToUpload, uploadedUrls, setImages, setUploadedUrls, setLoading]);

  useEffect(() => {
    uploadBatch();
  }, [filesToUpload, uploadBatch]);

  return (
    <div className="w-full max-w-md px-4">
      <Label className={`${mode==="dark"?"text-gray-300":"text-gray-700"} block font-semibold`}>Upload Images</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {uploadedUrls.map((url,i)=>
          <div key={i} className="relative w-24 h-24">
            <img src={url} className="w-full h-full object-cover rounded-lg"/>
            <button onClick={()=>handleRemove(i)} className="absolute top-0 right-0 bg-gray-600 text-white rounded-full p-1">
              <X size={12}/>
            </button>
          </div>
        )}
        <div onClick={()=>inputRef.current.click()} className="flex items-center justify-center w-24 h-24 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer">
          {loading ? <Loader2 className="animate-spin"/> : <CloudUpload className="text-gray-400"/>}
          <Input type="file" multiple className="hidden" ref={inputRef} accept="image/*" onChange={handleFiles} />
        </div>
      </div>
    </div>
  );
};

export default MultiImageUpload;
