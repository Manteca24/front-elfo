import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css"; 

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false); 

    const handleFavoriteClick = () => {
    setIsFavorited((prevState) => !prevState); // Cambiar entre verdadero y falso
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

  return (
    <div className={styles.cardContainer}>

      {products.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <img 
          src={product.image} 
          alt={product.name} 
          className={styles.productImage} />
          <div className={styles.favButtonContainer}>
            <button onClick={handleFavoriteClick} className={styles.favButton}>{isFavorited ? <img alt="filledHeart" src="./favorite.png" /> : <img alt="emptyHeart" src="./notFavorite.png" />}</button>
          </div>
        <Link to={`/product/${product._id}`} className={styles.dotsButton}>
          <div className={styles.cardContent}>
            <h2 className={styles.productTitle}>{product.name}</h2>
            <div className={styles.priceBubble}>
              <p>${product.price}</p>
            </div>
          </div>
        </Link>
        </div>
      ))}

    </div>
  );
};

export default ProductCard;