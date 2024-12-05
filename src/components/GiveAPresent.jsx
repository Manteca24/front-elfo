import React, { useState } from "react";

const GiveAPresent = ({ person, onClose }) => {
  console.log(person);
  const [type, setType] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [price, setPrice] = useState("");

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
    window.location.href = `/results?${new URLSearchParams(searchParams)}`;
  };

  return (
    <div className="give-present-modal">
      <h2>Regalar a {person.name}</h2>

      <h3>Características de {person.name}</h3>
      <ul>
        <li>Género: {person.gender}</li>
        <li>Edad: {person.ageRange}</li>
        <li>Relación: {person.relation}</li>
        {console.log(person)}
        <li>
          Filtros:
          {person.filters.map((filter) => (
            <span key={filter.filterId._id}>
              {filter.filterId.name} ({filter.tags.join(", ")}){" "}
              {/*error: tags son los que añade, pero en filters.filterId.tags están TODOS..*/}
            </span>
          ))}
        </li>
      </ul>

      <h3>Preferencias del regalo</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Tipo:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="diy">DIY</option>
            <option value="material">Material</option>
            <option value="experiencia">Experiencia</option>
          </select>
        </label>

        <label>
          Localización de compra:
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
          Presupuesto:
          <select value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="low">0€ - 20€</option>
            <option value="medium">20€ - 50€</option>
            <option value="high">50€ - 100€</option>
            <option value="luxury">Más de 100€</option>
          </select>
        </label>

        <button type="submit">Buscar regalos</button>
      </form>

      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default GiveAPresent;
