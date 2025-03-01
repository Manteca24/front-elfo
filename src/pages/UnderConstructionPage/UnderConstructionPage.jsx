import React from "react";
import { Link } from "react-router-dom";
import Styles from "./UnderConstructionPage.module.css";

const UnderConstructionPage = ({ pageName }) => {
  return (
    <div className={Styles.underConstructionContainer}>
      <h1 className={Styles.title}>🚧 Sección en reformas 🚧</h1>
      <p className={Styles.description}>
        Estoy trabajando duro para mejorar la experiencia en nuestra sección{" "}
        <span>{pageName}</span>.
      </p>
      <p>¡Vuelve pronto para descubrirlo!</p>
      <br />
      <Link to="/" className={Styles.backHomeLink}>
        Volver al inicio
      </Link>
    </div>
  );
};

export default UnderConstructionPage;
