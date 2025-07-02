const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
