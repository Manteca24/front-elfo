import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";
import { UserContext } from "../../contexts/UserContext";
import "../../App.css";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to track the location changes
  const { user, loading } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [placeholder, setPlaceholder] = useState("Quiero un regalo para...");
  const [filters, setFilters] = useState([]);

  const fetchFilters = async () => {
    try {
      const response = await axios.get("/filters");
      const data = response.data;

      const filterNames = data.map((filter) => filter.name);
      setFilters(filterNames);
    } catch (error) {
      console.error("Error al obtener filtros:", error);
    }
  };

  useEffect(() => {
    fetchFilters(); // Fetch filters when the component mounts
  }, []);

  useEffect(() => {
    const updatePlaceholder = () => {
      setFilters((prevFilters) => {
        if (prevFilters.length > 0) {
          const randomIndex = Math.floor(Math.random() * prevFilters.length);
          setPlaceholder(`Regalo para ${prevFilters[randomIndex]}...`);
        }
        return prevFilters; // Ensure the same filters remain
      });
    };

    updatePlaceholder(); // Run immediately to avoid delay

    const interval = setInterval(updatePlaceholder, 3000);

    return () => clearInterval(interval);
  }, [filters]); // Reacts to filter changes

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(`/search/products?search=${query}`, {
        params: { query },
      });

      setResults(response.data);
      // console.log(results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (results.length > 0) {
      navigate("/results", { state: { results } });
    }
  }, [results]);

  const clearSearch = () => {
    setQuery(""); // Reset the search query to empty
  };

  // Clear the search query whenever the location changes
  useEffect(() => {
    clearSearch();
  }, [location]);

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
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
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
              id="gift-search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            {query && (
              <button
                className={styles.clearButton}
                onClick={clearSearch}
                aria-label="Clear search"
              >
                X
              </button>
            )}
            <button
              className={styles.searchButton}
              onClick={handleSearch}
              aria-label="Buscar"
            ></button>
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
