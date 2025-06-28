// controllers/razorpayController.js
const crypto = require("crypto");
const { buildClient } = require("../../helpers/razorpay");
const Order = require("../../models/Orders");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");

const razorpay = buildClient();
// Create a Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { userId, cartId, cartItems, totalAmount, addressInfo } = req.body;
    if (
      !userId ||
      !Array.isArray(cartItems) ||
      !cartItems.length ||
      totalAmount == null
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    console.log(cartItems);
    const amountInPaise = Math.round(totalAmount * 100);
    const options = {
      amount: amountInPaise,
      currency: process.env.DEFAULT_CURRENCY,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    const razorOrder = await razorpay.orders.create(options);

    const user = await User.findById(userId);
    const newOrder = new Order({
      userId,
      userName: user.username,
      cartId,
      cartItems: cartItems.map((i) => ({
        productId: i.productId,
        title: i.title,
        image: i.image || "",
        price: i.price,
        quantity: i.quantity,
        size: i.size,
      })),
      addressInfo,
      orderStatus: "PENDING",
      paymentMethod: "RAZORPAY",
      paymentStatus: "UNPAID",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: razorOrder.id,
      payerId: "",
    });
    await newOrder.save();
    console.log(newOrder);

    res.status(201).json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: razorOrder.id,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
    });
  } catch (e) {
    console.error("createOrder error:", e);
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating order",
        error: e.message,
      });
  }
};

// Verify signature & capture payment
exports.capturePayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    order.payerId = razorpayPaymentId;

    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      product.quantity -= item.quantity;
      if (product.quantity < 0)
        throw new Error(`Insufficient stock for ${product.title}`);
      await product.save();
    }

    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured & order confirmed",
      data: order,
    });
  } catch (e) {
    console.error("capturePayment error:", e);
    res
      .status(500)
      .json({
        success: false,
        message: "Payment capture failed",
        error: e.message,
      });
  }
};

// Get all orders for a user
exports.getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }
    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.error("getAllOrdersByUser error:", e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// Get order details for a user
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.error("getOrderDetails error:", e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};
