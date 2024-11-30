import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css"; 

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false); 
  const [creator, setCreator] = useState([]); // Cambiado a un array

  const handleFavoriteClick = () => {
    setIsFavorited((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error al cargar los productos:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return; // Evita la llamada si no hay productos
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
            <button onClick={handleFavoriteClick} className={styles.favButton}>
              {isFavorited ? <img alt="filledHeart" src="./favorite.png" /> : <img alt="emptyHeart" src="./notFavorite.png" />}
            </button>
          </div>
          <Link to={`/product/${product._id}`} className={styles.dotsButton}>
            <div className={styles.cardContent}>
              <h2 className={styles.productTitle}>{product.name}</h2>
              <div className={styles.priceBubble}>
                <p>${product.price}</p>
              </div>
            </div>
            {/* <Link to={'/perfildeUsuario'} // construir con fetch esta página (PENDIENTE) */}
            <div className={styles.owner}>
              By {creator.find((c) => c._id === product.user)?.username || "Unknown"}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;