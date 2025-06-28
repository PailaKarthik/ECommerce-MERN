require("dotenv").config();
const express = require("express");
const connecToDB = require("./database/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-route");
const adminProductRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminSearchRouter = require('./routes/admin/search-routes')
const shoptProductRouter = require("./routes/shop-views/products-routes");
const shopCartRouter = require("./routes/shop-views/cart-routes");
const shopAddressRouter = require("./routes/shop-views/address-routes");
const shopOrderRouter = require("./routes/shop-views/order-routes");
const shopSearchRouter = require("./routes/shop-views/search-routes");
const shopReviewRouter = require("./routes/shop-views/review-routes");
const commonFeatureImagesRouter = require("./routes/common/feature-routes");

const app = express();
connecToDB();

// Middleware to parse JSON requests
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/search", adminSearchRouter);

app.use("/api/shop/products", shoptProductRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/images", commonFeatureImagesRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
