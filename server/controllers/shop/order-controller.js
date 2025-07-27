// controllers/razorpayController.js
const crypto = require("crypto");
const { buildClient } = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");

const razorpay = buildClient();

// Helper function to parse size string (e.g., "L=21,M=8,S=12")
const parseSizeString = (sizeString) => {
  if (!sizeString || sizeString === "-") return {};
  
  const sizes = {};
  sizeString.split(',').forEach(item => {
    const [size, quantity] = item.trim().split('=');
    if (size && quantity) {
      sizes[size.trim()] = parseInt(quantity) || 0;
    }
  });
  return sizes;
};

// Helper function to convert size object back to string
const sizesToString = (sizesObj) => {
  const entries = Object.entries(sizesObj).filter(([_, qty]) => qty > 0);
  return entries.length > 0 ? entries.map(([size, qty]) => `${size}=${qty}`).join(',') : "-";
};

// Helper function to update product sizes
const updateProductSizes = async (product, orderedSize, orderedQuantity) => {
  if (!orderedSize || orderedSize === "-") {
    // No size specified, just update general quantity
    product.quantity = Math.max(0, product.quantity - orderedQuantity);
    return;
  }

  // Check if product uses new unified sizes format
  if (product.sizes && product.sizes !== "-") {
    const currentSizes = parseSizeString(product.sizes);
    
    if (currentSizes[orderedSize]) {
      currentSizes[orderedSize] = Math.max(0, currentSizes[orderedSize] - orderedQuantity);
      product.sizes = sizesToString(currentSizes);
    }
  } else {
    // Handle legacy tshirtSizes and pantSizes format
    let updated = false;
    
    // Check and update tshirtSizes
    if (product.tshirtSizes && product.tshirtSizes !== "-") {
      const tshirtSizes = parseSizeString(product.tshirtSizes);
      if (tshirtSizes[orderedSize]) {
        tshirtSizes[orderedSize] = Math.max(0, tshirtSizes[orderedSize] - orderedQuantity);
        product.tshirtSizes = sizesToString(tshirtSizes);
        updated = true;
      }
    }
    
    // Check and update pantSizes if not found in tshirtSizes
    if (!updated && product.pantSizes && product.pantSizes !== "-") {
      const pantSizes = parseSizeString(product.pantSizes);
      if (pantSizes[orderedSize]) {
        pantSizes[orderedSize] = Math.max(0, pantSizes[orderedSize] - orderedQuantity);
        product.pantSizes = sizesToString(pantSizes);
        updated = true;
      }
    }
  }
  
  // Always update general quantity as well
  product.quantity = Math.max(0, product.quantity - orderedQuantity);
};

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
        totalCost: i.totalCost,
        meters: i.meters,
        category: i.category, 
        pricePerMeter: i.pricePerMeter,
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

    // Check stock availability before processing
    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      
      // Check if there's enough stock for the specific size
      if (item.size && item.size !== "-") {
        let sizeAvailable = false;
        let availableQuantity = 0;
        
        // Check new unified sizes format
        if (product.sizes && product.sizes !== "-") {
          const currentSizes = parseSizeString(product.sizes);
          if (currentSizes[item.size]) {
            availableQuantity = currentSizes[item.size];
            sizeAvailable = true;
          }
        } else {
          // Check legacy formats
          if (product.tshirtSizes && product.tshirtSizes !== "-") {
            const tshirtSizes = parseSizeString(product.tshirtSizes);
            if (tshirtSizes[item.size]) {
              availableQuantity = tshirtSizes[item.size];
              sizeAvailable = true;
            }
          }
          
          if (!sizeAvailable && product.pantSizes && product.pantSizes !== "-") {
            const pantSizes = parseSizeString(product.pantSizes);
            if (pantSizes[item.size]) {
              availableQuantity = pantSizes[item.size];
              sizeAvailable = true;
            }
          }
        }
        
        if (!sizeAvailable || availableQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.title} in size ${item.size}`);
        }
      } else {
        // No size specified, check general quantity
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.title}`);
        }
      }
    }

    // Update order status
    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    order.payerId = razorpayPaymentId;

    // Update product quantities and sizes
    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      
      // Update sizes and quantity
      await updateProductSizes(product, item.size, item.quantity);
      
      // Validate that quantity didn't go negative
      if (product.quantity < 0) {
        throw new Error(`Insufficient stock for ${product.title}`);
      }
      
      await product.save();
    }

    // Delete cart and save order
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