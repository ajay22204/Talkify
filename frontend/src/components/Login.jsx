import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e, type) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8080/auth/${type}`;
      const response = await axios.post(url, { username, password });
      if (type === "login") {
        localStorage.setItem("token", response.data.token); 
        navigate("/talkify");
      } else {
        alert("Signup successful! Please log in.");
        setIsSignup(false);
      }
    } catch (error) {
      setError(`${type === "login" ? "Login" : "Signup"} failed: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-indigo-900 text-white">
      <h1 className="text-4xl font-bold mb-4 glow-text">Talkify</h1>
      <p className="text-lg mb-10">Your ultimate translator and speech app</p>
      <form
        onSubmit={(e) => handleAuth(e, isSignup ? "signup" : "login")}
        className="bg-white/10 p-8 rounded-lg shadow-md w-full max-w-xs border-2 border-purple-500 backdrop-blur-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-300">{isSignup ? "Sign Up" : "Login"}</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 bg-transparent border-b-2 border-purple-300 text-white placeholder-gray-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-transparent border-b-2 border-purple-300 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full py-2 rounded font-semibold transition transform hover:scale-105 bg-purple-600 hover:bg-purple-500 text-white"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <p className="text-center mt-4 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-purple-300 underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginSignup;
