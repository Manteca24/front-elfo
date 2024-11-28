import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import LogoutButton from "./LogOutButton";


const NavBar = () => {
  const { user, loading } = useContext(UserContext); 
  if (loading) return <p>Loading...</p>;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to={user ? "/dashboard" : "/"}>
          <img src="/logo1.png" alt="Elfo logo" className={styles.logoImage} />
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/most-gifted">Los Más Regalados</Link>
        <Link to="/news">Novedades</Link>
      </div>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Buscar regalos..." />
      </div>
      <div className={styles.authButtons}>
        {user ? (
          <div className={styles.profileContainer}>
          <Link to="/profile" className={styles.profile}>
            <img src="/profile-icon.png" alt="Perfil" className={styles.profileIcon} />
            <span>Perfil de {user.user.username}</span>
          </Link>
          <LogoutButton />
          </div>
        ) : (
          <>
            <Link to="/login" className={styles.button}>Iniciar Sesión</Link>
            <Link to="/register" className={styles.button}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;