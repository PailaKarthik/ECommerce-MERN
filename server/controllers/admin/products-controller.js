const { uploadImage } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files provided" });
    }
    const uploads = await Promise.all(
      req.files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const { url } = await uploadImage(dataURI);
        return url;
      })
    );
    res.json({ success: true, message: "Images uploaded", urls: uploads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload error" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { images, title, description, category, brand, tshirtSizes, pantSizes, price, sellPrice, quantity } = req.body;
    const newProd = await Product.create({ images, title, description, category, brand, tshirtSizes, pantSizes, price: price||0, sellPrice: sellPrice||0, quantity });
    res.status(201).json({ success: true, data: newProd });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const list = await Product.find({});
    res.json({ success: true, data: list });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const prod = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!prod) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: prod });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct };
