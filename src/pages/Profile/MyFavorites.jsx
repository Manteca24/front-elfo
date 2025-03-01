import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Styles from "./Profile.module.css";
import "../../styles/buttons.css";
import "../../styles/modalWindows.css";
import "../../App.css";

const MyFavorites = () => {
  const { user } = useContext(UserContext);
  const [favoriteDetails, setFavoriteDetails] = useState([]);
  const [favoritesToShow, setFavoritesToShow] = useState(5);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      try {
        const promises = user.user.favoriteProducts.map(async (fav) => {
          const response = await axios.get(`/products/${fav.product}`);
          return response.data;
        });

        const favorites = await Promise.all(promises);

        setFavoriteDetails(favorites);
      } catch (err) {
        console.error(
          "Error al cargar los detalles de los productos favoritos:",
          err
        );
      }
    };

    if (user?.user?.favoriteProducts?.length > 0) {
      fetchFavoriteDetails();
    }
  }, [user]);

  return (
    <div className={Styles.myFavorites}>
      <h2>Mis favoritos</h2>
      <Link to="/profile" className="back-button">
        Volver al perfil
      </Link>
      {favoriteDetails.length > 0 ? (
        <ul className={Styles.favoriteList}>
          {favoriteDetails.slice(0, favoritesToShow).map((fav, index) => (
            <li className={Styles.favoriteItem} key={index}>
              <Link to={`/product/${fav._id}`} className={Styles.favoriteLink}>
                <img src={fav.image} alt={fav.name} />
                <strong>{fav.name}</strong>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes favoritos guardados.</p>
      )}
      {favoriteDetails.length > favoritesToShow && (
        <button
          className="button-more"
          onClick={() => setFavoritesToShow(favoritesToShow + 5)} // Cargar 5 más
        >
          Mostrar más
        </button>
      )}
    </div>
  );
};

export default MyFavorites;
