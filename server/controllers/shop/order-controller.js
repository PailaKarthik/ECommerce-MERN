// controllers/paypalController.js
const {
  OrdersController,
  ApiError,
  CheckoutPaymentIntent,
} = require("@paypal/paypal-server-sdk");
const { buildClient } = require("../../helpers/paypal");
const Order = require("../../models/Orders");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");

const ordersController = new OrdersController(buildClient());

const createOrder = async (req, res) => {
  // Initialize PayPal SDK configuration

  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      orderUpdateDate,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0 ||
      totalAmount == null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: userId, non-empty cartItems, totalAmount",
      });
    }

    // Determine currency from env
    const currency = process.env.DEFAULT_CURRENCY;

    const valueStr = totalAmount.toFixed(2);
    const orderRequestBody = {
      intent: CheckoutPaymentIntent.Capture, // immediate capture flow
      purchaseUnits: [
        {
          amount: {
            currencyCode: currency,
            value: valueStr,
          },
        },
      ],
      applicationContext: {
        returnUrl: process.env.PAYPAL_RETURN_URL,
        cancelUrl: process.env.PAYPAL_CANCEL_URL,
      },
    };

    let response = await ordersController.createOrder({
      body: orderRequestBody,
      prefer: "return=representation",
    });

    const orderResult = response.result;
    const payPalOrderId = orderResult.id;
    // Find approval link
    const approveLinkObj = Array.isArray(orderResult.links)
      ? orderResult.links.find((l) => l.rel === "approve")
      : null;
    const approveURL = approveLinkObj ? approveLinkObj.href : null;

    if (!approveURL) {
      console.warn("No PayPal approval URL returned for order:", payPalOrderId);
    }

    const user = await User.findById(userId);
    console.log(user)
    const userName = user.username;
    // Persist Order: store PayPal Order ID in paymentId initially
    const newOrder = new Order({
      userId,
      userName: userName,
      cartId: cartId,
      cartItems: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image || "",
        price: item.price,
        quantity: item.quantity,
      })),
      addressInfo: addressInfo,
      orderStatus: orderStatus || "PENDING",
      paymentMethod: paymentMethod || "PAYPAL",
      paymentStatus: paymentStatus || "UNPAID",
      totalAmount: totalAmount,
      orderDate: orderDate,
      orderUpdateDate: orderUpdateDate,
      paymentId: payPalOrderId,
      payerId: "",
    });
    await newOrder.save();

    return res.status(201).json({
      success: true,
      orderId: newOrder._id,
      approveURL,
      message: "PayPal order created. Redirect user to approveURL.",
    });
  } catch (e) {
    console.error("Error in createOrder:", e);
    if (e instanceof ApiError) {
      console.error(
        "PayPal ApiError status:",
        e.statusCode,
        "debugId:",
        e.debugId,
        "details:",
        e.details
      );
    }
    return res.status(500).json({
      success: false,
      message: "Error during PayPal order creation",
      error: e.message,
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { orderId, payerId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this Product ${product.title}`,
        });
      }

      product.quantity -= item.quantity;
      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error Occured",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error Occured",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
