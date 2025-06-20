const express = require("express");
const router = express.Router();

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQuantity,
} = require("../../controllers/shop/cart-controller");



router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update-quantity", updateCartItemQuantity);
router.delete("/delete/:userId/:productId", deleteCartItem);

module.exports = router;
