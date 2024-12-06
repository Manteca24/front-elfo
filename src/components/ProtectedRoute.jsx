import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [sessionExpired, setSessionExpired] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      return; // Si no hay token, no hacemos nada (se redirige en el retorno)
    }

    const isTokenExpired = () => {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decodifica el payload del token JWT
      const expirationTime = tokenPayload.exp * 1000; // La fecha de expiración está en segundos, la convertimos a milisegundos
      return expirationTime < Date.now();
    };

    if (isTokenExpired()) {
      localStorage.removeItem("authToken"); // Elimina el token caducado
      setSessionExpired(true); // Marca que la sesión ha expirado
    }
  }, [token]);

  if (sessionExpired) {
    return (
      <div>
        <p>Su sesión ha caducado. Inicie sesión nuevamente.</p>
        <Navigate to="/login" /> {/* Redirige después de mostrar el mensaje */}
      </div>
    );
  }

  // Si el token es válido, renderiza los hijos (ruta protegida)
  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
