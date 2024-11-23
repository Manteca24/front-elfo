import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const urlApi = import.meta.env.VITE_BACKEND_URL

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
    <div>
      <h1>Conexión Frontend - Backend</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;