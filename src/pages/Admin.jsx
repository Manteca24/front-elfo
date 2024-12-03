import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

const Admin = () => {
    const { user, loading } = useContext(UserContext);
    console.log(user)

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (user && !user.user.isAdmin) {
        return <div>No eres administrador</div>;
    }

    return (
        <>
            <h1>Panel de administración</h1>
            <Link to="/admin/categories">Gestión de categorías</Link>
            <Link to="/admin/filters">Gestión de filtros</Link>
        </>
    );
};

export default Admin;