import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Talkify from "./components/Talkify";  
import LoginSignup from "./components/Login"; 

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); 
    } else {
      navigate("/talkify"); 
    }
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/talkify" element={<Talkify />} />
      </Routes>
    </div>
  );
};

export default App;
