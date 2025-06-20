import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginFormControls } from "../../config";
import CommonForm from "../../components/common/form";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth-slice";
import { toast } from "sonner";
import { CircleArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AuthLogin = () => {
  const dispatch = useDispatch();
  const btnText = (
    <p className="flex gap-1 items-center">
      Next <CircleArrowRight />
    </p>
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData))
      .then((response) => {
        console.log("Login response:", response);
        if (response?.payload.success) {
          toast(response?.payload.message, {
            icon: "✅",
            duration: 2000,
            position: "top-center",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });
        } else {
          toast(response?.payload.message, {
            icon: "❌",
            duration: 3000,
            position: "bottom-center",
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md"
    >
      <div className="text-center mb-6">
        <div className="flex items-center border-2 border-gray-300 rounded-lg mb-2 cursor-pointer">
          <Link className="flex-1 p-2" to="/auth/register">
            Sign Up
          </Link>
          <h1 className="flex-1 border-r-2 p-2 bg-gray-600 text-white rounded-lg">
            Sign In
          </h1>
        </div>

        <CommonForm
          formControls={loginFormControls}
          ButtonText={btnText}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          mode="light"
        />
      </div>
    </motion.div>
  );
};

export default AuthLogin;
