import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
