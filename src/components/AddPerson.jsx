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
  const [showModal, setShowModal] = useState(false); // Para mostrar/ocultar modal
  const [currentFilter, setCurrentFilter] = useState(null); // Filtro actual para el modal
  const [gender, setGender] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [relation, setRelation] = useState("");
  const [customTag, setCustomTag] = useState(""); // Nuevo estado para tags personalizados

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

  // Mostrar el modal para añadir tags
  const openModal = (filter) => {
    setCurrentFilter(filter);
    setShowModal(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Agregar tag al filtro seleccionado
  const addTagToFilter = (tag) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [currentFilter._id]: [...(prev[currentFilter._id] || []), tag],
    }));
  };

  // Manejar el envío de un tag personalizado
  const handleAddCustomTag = () => {
    if (!customTag.trim()) return; // No hacer nada si el campo está vacío
    setSelectedFilters((prev) => ({
      ...prev,
      [currentFilter._id]: [...(prev[currentFilter._id] || []), customTag],
    }));
    setCustomTag(""); // Limpiar el campo de entrada
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
        "Por favor, completa todos los campos y selecciona al menos un filtro."
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

        {/* Relación con el usuario */}
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

        {/* Lista de filtros disponibles */}
        <div className={styles.filters}>
          <h3>Filtros disponibles:</h3>
          {categories.map((category) => (
            <div key={category._id}>
              <h4>{category.name}</h4>
              {category.filters.map((filter) => (
                <div key={filter._id}>
                  <button
                    type="button"
                    onClick={() => toggleFilter(filter._id)}
                  >
                    {selectedFilters[filter._id] ? "Eliminar" : "Añadir"}{" "}
                    {filter.name}
                  </button>
                  {/* Mostrar solo los filtros seleccionados */}
                  {selectedFilters[filter._id] && (
                    <div>
                      <button type="button" onClick={() => openModal(filter)}>
                        Editar tags
                      </button>
                      <ul>
                        {selectedFilters[filter._id].map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button type="submit">Guardar Persona</button>
      </form>

      {/* Modal de filtro */}
      {showModal && currentFilter && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{currentFilter.name}</h2>
            <div className={styles.tagList}>
              {currentFilter.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTagToFilter(tag)}
                  className={styles.tagButton}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Input para tags personalizados */}
            <div>
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Añadir un tag personalizado"
              />
              <button type="button" onClick={handleAddCustomTag}>
                Añadir Tag
              </button>
            </div>

            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPerson;
