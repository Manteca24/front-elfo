import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function LogoutButton() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/");
  };

  return (
    <button className="button" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
}

export default LogoutButton;
