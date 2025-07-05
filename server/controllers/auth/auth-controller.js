//register
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const admin = require("../../database/firebaseAdmin");

const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    // Verify token with Firebase
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log(decoded);
    const { uid, email, name, picture } = decoded;

    // Upsert user in MongoDB
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        username: name,
        email,
        avatar: picture,
        // you can set a random password or flag as OAuth user
      });
    }

    // Issue your own JWT & cookie
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "30d" }
    );

    res
      .cookie("token", token, { httpOnly: true, secure: true,sameSite :'none' })
      .json({
        success: true,
        message: "User Login Successfully !",
        user: { id: user._id, username: user.username, email: user.email },
      });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
};

// const registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const checkUser = await User.findOne({ email });
//     if (checkUser) {
//       return res.json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     const hashPassword = await bcrypt.hash(password, 12);
//     const newUser = User.create({
//       username,
//       email,
//       password: hashPassword,
//     });
//     console.log("serverside : ", newUser);
//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User not found with this email! Please register first.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        username: checkUser.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION || "30d",
      }
    );

    // res.status(200).json({
    //   success: true,
    //   message: "Logged in Successfully",

    //   user: {
    //     id: checkUser._id,
    //     username: checkUser.username,
    //     email: checkUser.email,
    //     role: checkUser.role,
    //   },
    // });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite : 'none'
      })
      .json({
        success: true,
        message: "Login successfully",
        user: {
          id: checkUser._id,
          username: checkUser.username,
          email: checkUser.email,
          role: checkUser.role,
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

//logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token").json({
      success: true,
      message: "Logout successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized user",
//     });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (e) {
//     console.log(e);
//     res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }
// };

module.exports = {
  // registerUser,
  googleLogin,
  loginUser,
  logoutUser,
  authMiddleware,
};
