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

  // Fetch products and favorites in sequence
  useEffect(() => {
    const fetchProductsAndFavorites = async () => {
      try {
        // Fetch products first
        const response = await axios.get("/products");
        const productsData = response.data;
        setProducts(productsData);

        // Fetch favorites only if user exists
        if (user) {
          const favoritesResponse = await axios.get(`/users/favorites`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          // console.log("Fetched Favorites:", favoritesResponse.data);

          const favoriteProducts = new Set(
            favoritesResponse.data.map((fav) => fav.product._id.toString())
          );

          // console.log("favorite products:", favoriteProducts);

          // Ensure isFavorited is set only AFTER products are available
          const updatedFavorites = {};
          productsData.forEach((product) => {
            updatedFavorites[product._id] = favoriteProducts.has(product._id);
          });

          setIsFavorited(updatedFavorites);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchProductsAndFavorites();
  }, [user]); // Only re-run when the user changes

  // Toggle favorite status
  const handleFavoriteClick = async (productId) => {
    if (!user) return alert("Inicia sesión para marcar favoritos.");
    const newState = !isFavorited[productId]; // Optimistic UI update
    setIsFavorited((prev) => ({ ...prev, [productId]: newState }));

    try {
      if (newState) {
        await axios.post(
          `/users/favorites`,
          { productId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      } else {
        await axios.delete(`/users/favorites`, {
          data: { productId }, // Use the 'data' field to pass the body of the request
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      setIsFavorited((prev) => ({ ...prev, [productId]: !newState })); // Revert on error
    }
  };

  // Fetch creators after loading products
  useEffect(() => {
    if (products.length === 0) return;

    const fetchCreators = async () => {
      try {
        const creators = await Promise.all(
          products.map(async (product) => {
            const response = await axios.get(`users/user/${product.user}`);
            return response.data;
          })
        );
        setCreator(creators.filter(Boolean));
      } catch (err) {
        console.error("Error loading creators:", err);
      }
    };

    fetchCreators();
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
              onClick={() => handleFavoriteClick(product._id)}
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
                <p>{product.price}&nbsp;€</p>
                {/*The non-breaking space (&nbsp;) ensures that the number and the € symbol are treated as a single unit and will not break onto separate lines. */}
              </div>
            </div>
          </Link>
          <Link
            to={`/user/${creator.find((c) => c._id === product.user)?._id}`}
          >
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
