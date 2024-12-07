import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { UserContext } from "../../contexts/UserContext";
import "../../App.css";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [placeholder, setPlaceholder] = useState("Quiero un regalo para...");
  const [filters, setFilters] = useState([]);

  // Función para obtener palabras aleatorias
  const fetchFilters = async () => {
    try {
      const response = await axios.get("/filters"); // Asegúrate de que esta ruta apunte correctamente a tu backend
      const data = response.data;

      const filterNames = data.map((filter) => filter.name);
      setFilters(filterNames);
    } catch (error) {
      console.error("Error al obtener filtros:", error);
    }
  };

  useEffect(() => {
    fetchFilters();

    const interval = setInterval(() => {
      if (filters.length > 0) {
        const randomIndex = Math.floor(Math.random() * filters.length);
        setPlaceholder(`Quiero un regalo para ${filters[randomIndex]}...`);
      }
    }, 3000); // cada 3 segundos

    return () => clearInterval(interval);
  }, []);

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
      setQuery("");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log("No se encontraron productos.");
        setResults([]);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (results && results.length > 0) {
      navigate("/results", { state: { results } });
    } else if (results.length === 0) {
      navigate("/no-results");
      setQuery("");
    }
  }, [results]);

  return (
    <nav className={styles.navbar}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className={styles.logo}>
            <Link to={user ? "/dashboard" : "/"} onClick={handleLinkClick}>
              <img
                src="/logo2.png"
                alt="Elfo logo"
                className={styles.logoImage}
              />
            </Link>
          </div>
          <div
            className={`${styles.menuButton} ${menuOpen ? styles.active : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          ></div>
          <div
            className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}
          >
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
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />
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
        </>
      )}
    </nav>
  );
};

export default NavBar;
