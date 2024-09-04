import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImgUrl from "@/assets/logo.png"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Logging in with:", { email, password });
    // Add login logic here
  };

  const handleSignUpRedirect = () => {
    navigate("/signup"); // Redirect to signup page
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-20">
      {/* Logo */}
      <div className="mb-8">
        <img
          src={logoImgUrl}
          alt="Logo"
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        <div className="mb-4 text-left">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>

        <div className="mb-6 text-left">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleSignUpRedirect}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
