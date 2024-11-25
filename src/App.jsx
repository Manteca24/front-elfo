import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/SignUp"; 
import LogIn from "./pages/Login";
import NavBar from "./components/NavBar";
import  UserProvider  from "./contexts/UserContext";
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import LogoutButton from "./components/LogOutButton";


const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const urlApi = import.meta.env.VITE_BACKEND_URL;

  const fetchData = async () => {
    try {
      const response = await axios.get(urlApi);
      setData(response.data); 
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      setError("No se pudo conectar con el backend");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserProvider>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home data={data} error={error} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        {/* <Route path="/logout" element={<LogoutButton />} />  */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
            <Dashboard />
            </ProtectedRoute>} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
            <Profile />
            </ProtectedRoute>} />    

      </Routes>
    </Router>
    </UserProvider>
  );
};

export default App;