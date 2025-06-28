const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    images: [String],
    title: String,
    description: String,
    category: String,
    brand: String,
    tshirtSizes: String,
    pantSizes: String,
    price: Number,
    sellPrice: Number,
    sold: Number,
    quantity: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
