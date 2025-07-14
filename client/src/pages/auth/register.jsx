import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { loginWithGoogle, registerUser } from "../../store/auth-slice";
import { toast } from "sonner";
import { checkAuth } from "../../store/auth-slice";
import { registerFormControls } from "@/config";
import { CircleArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import CommonForm from "@/components/common/form";

const AuthRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const btnText = (
    <p className="flex gap-1 items-center">
      Next <CircleArrowRight />
    </p>
  );
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  function onSubmit(e) {
    e.preventDefault();
    dispatch(registerUser(formData))
      .then((response) => {
        console.log("Register response:", response);
        if (response?.payload.success) {
          toast(response?.payload.message, {
            description: "You can now login with your credentials.",
            icon: "✅",
            duration: 3000,
            position: "top-right",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });

          navigate("/auth/login");
        } else {
          toast(response?.payload.message, {
            icon: "❌",
            duration: 3000,
            position: "bottom-right",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });
        }
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  }

  const handleGoogle = () => {
    dispatch(loginWithGoogle())
      .then((response) => {
        console.log(response);
        const { success, message } = response.payload;
        console.log(success, message);
        if (response.payload.success) {
          dispatch(checkAuth());
        }
        toast(message, {
          icon: success ? "✅" : "❌",
          duration: success ? 2000 : 3000,
          position: success ? "top-center" : "bottom-center",
          style: { backgroundColor: "black", color: "white" },
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className=" flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      <div
        className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`}
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1,
        }}
        className="relative z-10 w-full max-w-md rounded-3xl"
      >
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-2"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </motion.div>
            </div>

            {/* form */}
            <div className="text-center">
              <div className="flex items-center border-2 border-gray-300 rounded-lg mb-2">
                <h1 className="flex-1 border-r-2 p-2 bg-gray-600 text-white rounded-lg">
                  Sign Up
                </h1>
                <Link className="flex-1 p-2" to="/auth/login">
                  Sign In
                </Link>
              </div>
              <CommonForm
                formControls={registerFormControls}
                ButtonText={btnText}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                mode="light"
              />
            </div>
          </motion.div>

          {/* Google Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              onClick={handleGoogle}
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                cursor-pointer
                w-full flex items-center justify-center gap-3 px-6 py-4 
                bg-white/95 hover:bg-white transition-all duration-300
                border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl
                font-semibold text-gray-700 group
                ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }
              `}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FaGoogle className="text-xl text-red-500" />
                </motion.div>
              )}
              <span className="text-base">
                {isLoading ? "Signing in..." : "Continue with Google"}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthRegister;
