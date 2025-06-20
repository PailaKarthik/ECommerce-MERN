import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerFormControls } from "../../config";
import CommonForm from "../../components/common/form";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { toast } from "sonner";
import { CircleArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AuthRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        console.log("Registration response:", response);
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md"
    >
      <div className="text-center mb-">
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
  );
};

export default AuthRegister;
