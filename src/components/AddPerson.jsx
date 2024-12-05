import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { auth } from "../config/firebase";
import styles from "./AddPerson.module.css";

const AddPerson = () => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [newTag, setNewTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [gender, setGender] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [relation, setRelation] = useState("");

  // Cargar categorías al principio
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/filters/grouped");
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (user) fetchCategories();
  }, [user]);

  // Cambiar el nombre
  const handleNameChange = (e) => setName(e.target.value);

  // Seleccionar/deseleccionar filtros
  const toggleFilter = (filterId) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[filterId]) {
        delete updatedFilters[filterId];
      } else {
        updatedFilters[filterId] = [];
      }
      return updatedFilters;
    });
  };

  // Agregar etiqueta a un filtro
  const addTagToFilter = (filterId, tag) => {
    if (!tag.trim()) return;
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: [...(prev[filterId] || []), tag],
    }));
    setNewTag(""); // Limpiar input
  };

  // Eliminar etiqueta de un filtro
  const removeTagFromFilter = (filterId, tag) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: prev[filterId].filter((t) => t !== tag),
    }));
  };

  // Manejar cambios en el input de nuevo tag
  const handleNewTagChange = (e, filterId) => {
    const value = e.target.value;
    setNewTag(value);
    if (value.trim()) {
      const filter = categories
        .flatMap((cat) => cat.filters)
        .find((f) => f._id === filterId);
      if (filter) {
        const matchingTags = filter.tags.filter((tag) =>
          tag.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(matchingTags);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !gender ||
      !ageRange ||
      !relation ||
      Object.keys(selectedFilters).length === 0
    ) {
      alert(
        "Por favor, completa todo los campos y selecciona al menos un filtro."
      );
      return;
    }

    // Transformar selectedFilters a la estructura correcta
    const filters = Object.entries(selectedFilters).map(([filterId, tags]) => ({
      filterId,
      tags,
    }));

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      await axios.post(
        "/users/saved-people",
        { name, gender, ageRange, relation, filters },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Persona añadida correctamente.");
      setName("");
      setGender("");
      setAgeRange("");
      setSelectedFilters({});
    } catch (error) {
      console.error("Error añadiendo persona:", error);
      alert("No se pudo añadir la persona.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Añadir Persona</h1>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className={styles.inputGroup}>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>

        {/* Género */}
        <div className={styles.inputGroup}>
          <label>Género:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="no relevante">No relevante</option>
          </select>
        </div>

        {/*Relación con el usuario*/}
        <div className={styles.inputRelation}>
          <label>Relación contigo:</label>
          <select
            name="relation"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            required
          >
            <option value="">Selecciona una relación</option>
            <option value="madre">Madre</option>
            <option value="padre">Padre</option>
            <option value="hermana">Hermana</option>
            <option value="hermano">Hermano</option>
            <option value="hija">Hija</option>
            <option value="hijo">Hijo</option>
            <option value="abuela">Abuela</option>
            <option value="abuelo">Abuelo</option>
            <option value="tía">Tía</option>
            <option value="tío">Tío</option>
            <option value="prima">Prima</option>
            <option value="primo">Primo</option>
            <option value="amiga">Amiga</option>
            <option value="amigo">Amigo</option>
            <option value="sobrina">Sobrina</option>
            <option value="sobrino">Sobrino</option>
            <option value="pareja">Pareja</option>
            <option value="novia">Novia</option>
            <option value="novio">Novio</option>
            <option value="esposo">Esposo</option>
            <option value="esposa">Esposa</option>
            <option value="compañero de trabajo">Compañero de trabajo</option>
            <option value="compañera de trabajo">Compañera de trabajo</option>
            <option value="jefe">Jefe</option>
            <option value="jefa">Jefa</option>
            <option value="vecino">Vecino</option>
            <option value="profesor">Profesor</option>
            <option value="alumno">Alumno</option>
            <option value="alumna">Alumna</option>
            <option value="profesora">Profesora</option>
            <option value="vecina">Vecina</option>
            <option value="cliente">Cliente</option>
            <option value="mascota">Mascota</option>
          </select>
        </div>

        {/* Rango de edad */}

        <div className={styles.inputGroup}>
          <label>Rango de Edad:</label>
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            <option value="bebé">Bebé</option>
            <option value="niño">Niño</option>
            <option value="adolescente">Adolescente</option>
            <option value="adulto">Adulto</option>
            <option value="anciano">Anciano</option>
          </select>
        </div>

        {/* Categorías y filtros */}
        <div className={styles.categories}>
          {categories.map((category) => (
            <div key={category._id} className={styles.category}>
              <h3>{category.name}</h3>
              {category.filters.map((filter) => (
                <div key={filter._id} className={styles.filter}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!selectedFilters[filter._id]}
                      onChange={() => toggleFilter(filter._id)}
                    />
                    {filter.name}
                  </label>

                  {/* Tags asociados al filtro */}
                  {selectedFilters[filter._id] && (
                    <div>
                      <div className={styles.tags}>
                        {selectedFilters[filter._id].map((tag, idx) => (
                          <span key={idx} className={styles.tag}>
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                removeTagFromFilter(filter._id, tag)
                              }
                            >
                              X
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Añadir nuevo tag */}
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => handleNewTagChange(e, filter._id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTagToFilter(filter._id, newTag);
                          }
                        }}
                        placeholder="Nuevo tag"
                      />
                      <button
                        type="button"
                        onClick={() => addTagToFilter(filter._id, newTag)}
                      >
                        Añadir
                      </button>

                      {/* Sugerencias de tags */}
                      {suggestions.length > 0 && (
                        <ul className={styles.suggestions}>
                          {suggestions.map((tag, idx) => (
                            <li
                              key={idx}
                              onClick={() => addTagToFilter(filter._id, tag)}
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button type="submit">Añadir Persona</button>
      </form>
    </div>
  );
};

export default AddPerson;
