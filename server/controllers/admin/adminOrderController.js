const Order = require("../../models/Order");

exports.getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.error("getAllOrdersOfAllUsers error:", e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// Get single order (admin)
exports.getOrderDetailsForAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.error("getOrderDetailsForAdmin error:", e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (e) {
    console.error("updateOrderStatus error:", e);
    res.status(500).json({ success: false, message: "Internal server issue" });
  }
};