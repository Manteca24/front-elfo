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
    if (!name.trim() || Object.keys(selectedFilters).length === 0) {
      alert("Por favor, completa el nombre y selecciona al menos un filtro.");
      return;
    }
  
    const filters = Object.entries(selectedFilters).map(([filterId, tags]) => ({
      filterId,
      tags,
    }));
  
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      await axios.post(
        "/users/saved-people",
        { name, filters },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Persona añadida correctamente.");
      setName("");
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