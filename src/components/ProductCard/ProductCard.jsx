import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { UserContext } from "../../contexts/UserContext";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [isFavorited, setIsFavorited] = useState({});
  const [creator, setCreator] = useState([]);
  const { user } = useContext(UserContext);
  // console.log(user);

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
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data);
        const favoritesResponse = await axios.get(`/users/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const favoriteProducts = favoritesResponse.data.map((fav) =>
          fav.product.toString()
        );
        const favorites = {};
        products.forEach((product) => {
          favorites[product._id] = favoriteProducts.includes(
            product._id.toString()
          );
        });
        setIsFavorited(favorites);
      } catch (err) {
        console.error("Error al cargar los productos:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const fetchCreator = async () => {
      try {
        const creators = await Promise.all(
          products.map(async (product) => {
            const response = await axios.get(`users/user/${product.user}`);
            return response.data;
          })
        );
        setCreator(creators.filter(Boolean));
      } catch (err) {
        console.error("Error al cargar los creadores:", err);
      }
    };
    fetchCreator();
  }, [products]);

  return (
    <div className={styles.cardContainer}>
      {products.map((product) => (
        <div key={product._id} className={styles.productCard}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
          />
          <div className={styles.favButtonContainer}>
            <button
              onClick={() => {
                if (!user)
                  return alert("Debes iniciar sesión para esta funcionalidad.");
                handleFavoriteClick(product._id);
              }}
              className={styles.favButton}
            >
              {isFavorited[product._id] ? (
                <img alt="filledHeart" src="./favorite.png" />
              ) : (
                <img alt="emptyHeart" src="./notFavorite.png" />
              )}
            </button>
          </div>
          <Link to={`/product/${product._id}`} className={styles.dotsButton}>
            <div className={styles.cardContent}>
              <h2 className={styles.productTitle}>{product.name}</h2>
              <div className={styles.priceBubble}>
                <p>{product.price} €</p>
              </div>
            </div>
            <div className={styles.owner}>
              By{" "}
              {creator.find((c) => c._id === product.user)?.username ||
                "Unknown"}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
