import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import "../../App.css";

const NavBar = () => {
  const { user, loading } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  if (loading) return <p>Loading...</p>;

   // Cierra el menú al hacer clic en un enlace
   const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to={user ? "/dashboard" : "/"} onClick={handleLinkClick}>
          <img src="/logo2.png" alt="Elfo logo" className={styles.logoImage} />
        </Link>
      </div>
      <div
        className={`${styles.menuButton} ${menuOpen ? styles.active : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      ></div>
      <div className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
        <Link to="/most-gifted" onClick={handleLinkClick}>LOS MÁS REGALADOS</Link>
        <Link to="/news" onClick={handleLinkClick}>NOVEDADES</Link>
        {user && (
          <div className={`${styles.profileContainer} ${styles.mobileOnly}`}>
            <Link to="/profile" className={styles.profile} onClick={handleLinkClick}>
              <img
                src="/elfoProfile.png"
                alt="Perfil"
                className={styles.profileIcon}
              />
              <span>Perfil de {user.user.username}</span>
            </Link>
          </div>
        )}
      </div>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Quiero un regalo para..." /> {/*+ hashtags*/}
      </div>
      <div
        className={`${styles.authButtons} ${
          user ? styles.desktopOnly : ""
        }`}
      >
        {user ? (
          <div className={styles.profileContainer}>
            <Link to="/profile" className={styles.profile}>
              <img
                src="/elfoProfile.png"
                alt="Perfil"
                className={styles.profileIcon}
              />
              <span>Perfil de {user.user.username}</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="button">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="button">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;