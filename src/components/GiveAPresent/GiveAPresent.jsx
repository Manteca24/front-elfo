import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./GiveAPresent.module.css";
import "../../styles/modalWindows.css";
import "../../styles/buttons.css";
import axios from "axios";

const GiveAPresent = ({ person, onClose }) => {
  console.log(person);
  const [type, setType] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const giftPreferences = {
      type,
      purchaseLocation,
      price,
    };

    console.log("giftPreferences:", giftPreferences);

    // Combine person's characteristics with gift preferences
    const searchParams = {
      ...person,
      ...giftPreferences,
    };

    console.log("searchParams:", searchParams);

    try {
      // Make a GET request with searchParams as query parameters
      const response = await axios.get(`/search/`, { params: searchParams });

      // Navigate to results page with retrieved results
      navigate("/results", { state: { results: response.data } });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  return (
    <div className="modal">
      <div className="modalContent">
        <div className={Styles.GiveAGiftModal}>
          <h2 className="title">
            Regalar a <span>{person.name}</span>
          </h2>
          <h4 className="subtitles">Características de {person.name}</h4>
          <ul className="immutableCharacteristics">
            <li>
              <span>Género: </span>
              {person.gender}
            </li>
            <li>
              <span>Edad: </span>
              {person.ageRange}
            </li>
            <li>
              <span>Relación: </span>
              {person.relation}
            </li>
          </ul>
          {/* {console.log(person)} */}
          <ul
            className={`mutableCharacteristics ${clicked ? "clicked" : ""}`}
            onClick={handleClick}
          >
            <span>Filtros: </span>
            {person.filters.map((filter) => (
              <li key={filter.filterId._id}>
                · {filter.filterId.name} ({filter.tags.join(", ")})
              </li>
            ))}
          </ul>

          <h4 className="subtitles">Preferencias del regalo</h4>
          <form onSubmit={handleSubmit}>
            <div className="giftForm">
              <label>
                Tipo:{"    "}
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Seleccionar</option>
                  <option value="diy">DIY</option>
                  <option value="material">Material</option>
                  <option value="experiencia">Experiencia</option>
                </select>
              </label>

              <label>
                Localización de compra:{"    "}
                <select
                  value={purchaseLocation}
                  onChange={(e) => setPurchaseLocation(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="diy">¡Hazlo tú mismo!</option>
                  <option value="online">Online</option>
                  <option value="cadena">Cadena</option>
                  <option value="local">Tienda local</option>
                </select>
              </label>

              <label>
                Presupuesto:{"    "}
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="low">0€ - 20€</option>
                  <option value="medium">20€ - 50€</option>
                  <option value="high">50€ - 100€</option>
                  <option value="luxury">Más de 100€</option>
                </select>
              </label>
            </div>
            <div className="giftButton">
              <button className="greenButton" type="submit">
                Buscar regalos
              </button>
            </div>
          </form>
          <div className="modalCloseButton">
            <button className="button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveAPresent;
