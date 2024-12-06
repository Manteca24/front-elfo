import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./GiveAPresent.module.css";
import "../../styles/modalWindows.css";
import "../../styles/buttons.css";

const GiveAPresent = ({ person, onClose }) => {
  console.log(person);
  const [type, setType] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const giftPreferences = {
      type,
      purchaseLocation,
      price,
    };

    // Combina las características de la persona con las del regalo
    const searchParams = {
      ...person,
      ...giftPreferences,
    };

    // Redirige a la página de resultados con los parámetros
    navigate(`/results?${new URLSearchParams(searchParams).toString()}`);
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="title">
          Regalar a <span>{person.name}</span>
        </h2>
        <h3 className="subtitles">Características de {person.name}</h3>
        <ul className="list">
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
          {console.log(person)}
          <li>
            <span>Filtros: </span>
            {person.filters.map((filter) => (
              <p key={filter.filterId._id}>
                · {filter.filterId.name} ({filter.tags.join(", ")}){" "}
                {/*error: tags son los que añade, pero en filters.filterId.tags están TODOS..*/}
              </p>
            ))}
          </li>
        </ul>

        <h3 className="subtitles">Preferencias del regalo</h3>
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
              <select value={price} onChange={(e) => setPrice(e.target.value)}>
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
  );
};

export default GiveAPresent;
