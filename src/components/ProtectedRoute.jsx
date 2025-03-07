import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [sessionExpired, setSessionExpired] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;

    const isTokenExpired = () => {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decodifica el payload del token JWT
      const expirationTime = tokenPayload.exp * 1000; // Convertir a milisegundos
      return expirationTime < Date.now();
    };

    if (isTokenExpired()) {
      localStorage.removeItem("authToken"); // Remueve el token caducado
      setSessionExpired(true); // Marca que la sesión ha expirado
    }
  }, [token]);

  if (sessionExpired) {
    return (
      <div>
        <p>
          Su sesión ha caducado. Inicie sesión nuevamente para regresar a esta
          página.
        </p>
        <Navigate to="/login" state={{ from: location }} replace />
      </div>
    );
  }

  // Si el token es válido, renderiza los hijos; si no, redirige pasando el estado
  return token ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default ProtectedRoute;
