import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import CategoryManager from "../components/CategoryManager/CategoryManager";
import FilterManager from "../components/FilterManager/FilterManager";
import Styles from "../pages/Profile/Profile.module.css";

const Admin = () => {
  const { user, loading } = useContext(UserContext);
  console.log(user);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (user && !user.user.isAdmin) {
    return <div>No eres administrador</div>;
  }

  return (
    <>
      <h1>Panel de administración</h1>
      <Link to="/profile" className={Styles.backButton}>
        <svg className={Styles.arrowIcon} viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" /> {/* Left arrow */}
        </svg>
        <h5>Volver al perfil</h5>
      </Link>
      <CategoryManager />
      <FilterManager />
    </>
  );
};

export default Admin;
