const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size, totalCost, meters } = req.body;
    console.log("Cart data:", { size, totalCost, meters });

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "User ID, Product ID, and Quantity are required",
      });
    }

    const findProduct = await Product.findById(productId);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // For shirting products, update meters and recalculate totalCost
      if (meters !== null && meters !== undefined) {
        cart.items[existingItemIndex].meters += meters;
        // Recalculate totalCost based on new meters
        const basePrice =
          findProduct.sellPrice > 0 ? findProduct.sellPrice : findProduct.price;
        cart.items[existingItemIndex].totalCost =
          basePrice * cart.items[existingItemIndex].meters;
      } else {
        cart.items[existingItemIndex].quantity += quantity;
      }
    } else {
      cart.items.push({
        productId,
        quantity,
        size: size || "-",
        totalCost: totalCost || null,
        meters: meters || null,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart: cart,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.populate({
      path: "items.productId",
      select: "title price images sellPrice category",
    });

    // Remove any items where product was deleted
    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
      await cart.populate({
        path: "items.productId",
        select: "title price images sellPrice category",
      });
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      images: item.productId.images,
      title: item.productId.title,
      price: item.productId.price,
      sellPrice: item.productId.sellPrice,
      category: item.productId.category,
      quantity: item.quantity,
      size: item.size || "-",
      totalCost: item.totalCost,
      meters: item.meters,
    }));

    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      cart: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity, meters } = req.body;

    if (!userId || !productId || (!quantity && !meters)) {
      return res.status(400).json({
        success: false,
        message: "User ID, Product ID, and Quantity or Meters are required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Update quantity or meters based on product type
    if (meters !== undefined && meters !== null) {
      cart.items[existingItemIndex].meters = meters;

      // Recalculate totalCost for shirting products
      const product = await Product.findById(productId);
      if (product && product.category === "men-shirting") {
        const basePrice = product.sellPrice > 0 ? product.sellPrice : product.price;
        cart.items[existingItemIndex].totalCost = basePrice * meters;
      }
    } else {
      cart.items[existingItemIndex].quantity = quantity;
    }

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "title price images sellPrice category",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      images: item.productId ? item.productId.images : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      sellPrice: item.productId ? item.productId.sellPrice : null,
      category: item.productId ? item.productId.category : null,
      quantity: item.quantity,
      size: item.size || "-",
      totalCost: item.totalCost,
      meters: item.meters,
    }));

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items.splice(existingItemIndex, 1);

    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "title price images sellPrice category",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      images: item.productId ? item.productId.images : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      sellPrice: item.productId ? item.productId.sellPrice : null,
      category: item.productId ? item.productId.category : null,
      quantity: item.quantity,
      size: item.size || "-",
      totalCost: item.totalCost,
      meters: item.meters,
    }));

    return res.status(200).json({
      success: true,
      message: "Item deleted from cart successfully",
      cart: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQuantity,
  deleteCartItem,
};