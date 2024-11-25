// src/axiosConfig.js
import axios from "axios";

// Configura la URL base para todas las solicitudes de axios
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.headers.common["Cache-Control"] = "no-cache"; // Deshabilita la caché
axios.defaults.headers.common["Pragma"] = "no-cache";

const token = localStorage.getItem("authToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axios;
