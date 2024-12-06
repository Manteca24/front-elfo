import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import CategoryManager from "../components/CategoryManager/CategoryManager";
import FilterManager from "../components/FilterManager/FilterManager";

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
      <Link to="/profile">Volver al perfil</Link>
      <CategoryManager />
      <FilterManager />
    </>
  );
};

export default Admin;
