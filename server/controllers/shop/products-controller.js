const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {

    const {category = [],brand =[], sortBy ="priceLowToHigh" } = req.query;

    let filters = {};

    if(category.length) {
      filters.category = { $in: category.split(',') };
    }

    if(brand.length) {
      filters.brand = { $in: brand.split(',') };
    }

    let sort = {};

    switch (sortBy) {
      case "priceLowToHigh":
        sort.sellPrice = 1;
        break;
      case "priceHighToLow":
        sort.sellPrice = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.sellPrice = 1;
    }

    const products = await Product.find(filters).sort(sort);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id);

    if (!product) { 
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  }
  catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { getFilteredProducts,getProductDetails };
