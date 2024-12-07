import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import "../../App.css";
import axios from "axios";

const NavBar = () => {
  const { user, loading } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  if (loading) return <p>Loading...</p>;

  // Cierra el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(`/search/products`, {
        params: { query },
      });

      setResults(response.data);
      console.log(results);
    } catch (err) {
      console.error(err);
    }
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
        <div className={styles.exploreLinks}>
          <Link
            to="/most-gifted"
            onClick={handleLinkClick}
            style={{ color: "#cf0b05" }}
          >
            LOS MÁS REGALADOS
          </Link>
          <Link to="/news" onClick={handleLinkClick}>
            NOVEDADES
          </Link>
        </div>
        {user ? (
          <div className={styles.mobileOnly}>
            <Link
              to="/profile"
              className={styles.profile}
              onClick={handleLinkClick}
            >
              <img
                src="/elfoProfile.png"
                alt="Perfil"
                className={styles.profileIcon}
              />
              <span>Perfil de {user.user.username}</span>
            </Link>
          </div>
        ) : (
          <div className={styles.mobileOnly}>
            <Link
              to="/login"
              className={styles.button}
              onClick={handleLinkClick}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className={styles.button}
              onClick={handleLinkClick}
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Quiero un regalo para..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>
      <div
        className={`${styles.authButtons} ${user ? styles.desktopOnly : ""}`}
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
          <div className={styles.desktopOnly}>
            <Link to="/login" className="button">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="button">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
