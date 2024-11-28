import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import '../../App.css'


const NavBar = () => {
  const { user, loading } = useContext(UserContext); 
  if (loading) return <p>Loading...</p>;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to={user ? "/dashboard" : "/"}>
          <img src="/logo2.png" alt="Elfo logo" className={styles.logoImage} />
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/most-gifted">LOS MÁS REGALADOS</Link>
        <Link to="/news">NOVEDADES</Link>
      </div>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Quiero un regalo para..." /> {/*+ hashtags saliendo aleatorio*/}
      </div>
      <div className={styles.authButtons}>
        {user ? (
          <div className={styles.profileContainer}>
          <Link to="/profile" className={styles.profile}>
            <img src="/elfoProfile.png" alt="Perfil" className={styles.profileIcon} />
            <span>Perfil de {user.user.username}</span>
            <span className={styles.menuButton}></span>

          </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className='button'>Iniciar Sesión</Link>
            <Link to="/register" className='button'>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;