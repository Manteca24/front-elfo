import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Styles from "./ResultsPage.module.css";
import "../../App.css";
import axios from "axios";

const ResultsPage = () => {
  const { state } = useLocation();
  const results = state?.results || [];
  const [creator, setCreator] = useState([]);

  const [isFavorited, setIsFavorited] = useState({});

  const handleFavoriteClick = async (productId) => {
    if (isFavorited[productId]) {
      try {
        await axios.delete(`/users/favorites/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setIsFavorited((prev) => ({ ...prev, [productId]: false }));
      } catch (err) {
        console.error("Error al eliminar el favorito:", err);
      }
    } else {
      try {
        await axios.post(`/users/favorites`, { productId });
        setIsFavorited((prev) => ({ ...prev, [productId]: true }));
      } catch (err) {
        console.error("Error al añadir el favorito:", err);
      }
    }
  };

  useEffect(() => {
    if (results.length === 0) return;
    const fetchCreator = async () => {
      try {
        // console.log(results);
        const creators = await Promise.all(
          results.map(async (product) => {
            const response = await axios.get(`users/user/${product.user}`);
            // console.log(response.data);
            return response.data;
          })
        );
        setCreator(creators.filter(Boolean));
      } catch (err) {
        console.error("Error al cargar los creadores:", err);
      }
    };
    fetchCreator();
  }, [results]);

  return (
    <div>
      <h2>Resultados de la búsqueda</h2>
      <div className={Styles.cardContainer}>
        {results.length > 0 ? (
          results.map((product) => (
            <div key={product._id} className={Styles.productCard}>
              <img
                src={product.image}
                alt={product.name}
                className={Styles.productImage}
              />
              <div className={Styles.favButtonContainer}>
                <button
                  onClick={() => handleFavoriteClick(product._id)}
                  className={Styles.favButton}
                >
                  {isFavorited[product._id] ? (
                    <img alt="filledHeart" src="./favorite.png" />
                  ) : (
                    <img alt="emptyHeart" src="./notFavorite.png" />
                  )}
                </button>
              </div>
              <Link
                to={`/product/${product._id}`}
                className={Styles.dotsButton}
              >
                <div className={Styles.cardContent}>
                  <h2 className={Styles.productTitle}>{product.name}</h2>
                  <div className={Styles.priceBubble}>
                    <p>${product.price}</p>
                  </div>
                </div>
                <div className={Styles.owner}>
                  By{" "}
                  {creator.find((c) => c._id === product.user)?.username ||
                    "Unknown"}
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
