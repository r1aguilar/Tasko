import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    const isEmail = emailOrPhone.includes("@");
    const url = isEmail
      ? `http://140.84.190.203/login/email/${emailOrPhone}/${password}`
      : `http://140.84.190.203/login/${emailOrPhone}/${password}`;
  
    try {
      const response = await fetch(url);
      console.log("🌐 Llamando a:", url);
  
      if (!response.ok) {
        console.log("❌ Usuario no encontrado");
        setErrorMsg("User not found.");
        return;
      }
  
      const data = await response.json();
      console.log("📦 Datos recibidos:", data);
  
      // Redirecciones según tipo de usuario
      if (data.manager === false) {
        localStorage.setItem("userId", data.id);
        console.log("🧑‍💻 Developer → /dashdev");
        navigate("/dashdev");
      } else if (data.manager === true) {
        localStorage.setItem("userId", data.id);
        console.log("👨‍💼 Admin/Manager → /backlogMan");
        navigate("/backlogMan");
      } else {
        console.log("🚫 Usuario sin permisos");
        setErrorMsg("No access for this user.");
      }
  
    } catch (error) {
      console.error("💥 Error conectando con backend:", error);
      setErrorMsg("Server error.");
    }
  };
  
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-4 sm:px-6 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-black/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">LOGIN TO YOUR ACCOUNT</h2>
        <p className="text-gray-400 text-sm text-center mb-4 sm:mb-6">Enter your email or phone and password</p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full bg-gray-800 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <Mail className="absolute top-2.5 left-3 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <Lock className="absolute top-2.5 left-3 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <button className="text-blue-500 hover:underline">Forgot password?</button>
          </div>

          <button onClick={handleLogin}
            className="w-full py-2 bg-blue-600 rounded-md font-semibold hover:bg-blue-700 transition text-sm sm:text-base">
            LOGIN
          </button>
        </div>

        <div className="my-4 text-center text-gray-500 text-sm">Or continue with</div>

        <div className="flex justify-center">
          <button className="flex items-center justify-center bg-white text-black rounded-md py-2 px-4 hover:opacity-90 transition text-sm sm:text-base">
            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <a href="/registro" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginScreen;
