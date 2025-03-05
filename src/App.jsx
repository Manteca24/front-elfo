import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/SignUp";
import LogIn from "./pages/Login";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import UserProvider from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/Profile";
// import LogoutButton from "./components/LogOutButton";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import UploadGift from "./pages/UploadGift";
import CategoryManager from "./components/CategoryManager/CategoryManager";
import Admin from "./pages/Admin";
import FilterManager from "./components/FilterManager/FilterManager";
import SelectPerson from "./pages/SelectPerson/SelectPerson";
import ResultsPage from "./pages/ResultsPage/ResultsPage";
import UnderConstructionPage from "./pages/UnderConstructionPage/UnderConstructionPage";
import AboutUs from "./pages/AboutUs";
import Rules from "./pages/Rules";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Spinner from "./components/Spinner/Spinner";
import MyFavorites from "./pages/Profile/MyFavorites";
import MyComments from "./pages/Profile/MyComments";
import MyPeople from "./pages/Profile/MyPeople";
import User from "./pages/User/User";

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  const urlApi = import.meta.env.VITE_BACKEND_URL;

  const fetchData = async () => {
    try {
      const response = await axios.get(urlApi);
      setData(response.data);
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      setError("No se pudo conectar con el backend");
    } finally {
      setLoading(false); // Cuando los datos se cargan, se cambia el estado de loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserProvider>
      <Router>
        <NavBar />
        {/* Si está cargando, mostramos el spinner */}
        {loading ? (
          <Spinner /> // Asegúrate de tener un componente Spinner que muestre la animación de carga
        ) : (
          <Routes>
            <Route path="/" element={<Home data={data} error={error} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/user/:userId" element={<User />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-gift"
              element={
                <ProtectedRoute>
                  <UploadGift />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <CategoryManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/filters"
              element={
                <ProtectedRoute>
                  <FilterManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/select-person"
              element={
                <ProtectedRoute>
                  <SelectPerson />
                </ProtectedRoute>
              }
            />
            <Route path="/results" element={<ResultsPage />} />
            <Route
              path="/most-gifted"
              element={<UnderConstructionPage pageName="Más regalados" />}
            />
            <Route
              path="/news"
              element={<UnderConstructionPage pageName="Novedades" />}
            />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-favorites" element={<MyFavorites />} />
            <Route path="/my-people" element={<MyPeople />} />
            <Route path="/my-comments" element={<MyComments />} />
          </Routes>
        )}
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
