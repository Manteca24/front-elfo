import React from "react";
import { Link } from "react-router-dom";
import Styles from "./ResultsPage.module.css";

const NoResultsPage = () => {
  return (
    <div className={Styles.container}>
      <h1>No se encontraron resultados</h1>
      <p>
        Lo sentimos, pero no pudimos encontrar ninguna coincidencia con tu
        búsqueda.
      </p>
      <Link to="/" className={Styles.link}>
        Volver a la página principal
      </Link>
    </div>
  );
};

export default NoResultsPage;
