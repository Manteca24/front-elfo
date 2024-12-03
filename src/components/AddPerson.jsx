import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

const AddPerson = () => {
  const { user } = useContext(UserContext); // Obtener el contexto del usuario
  const [name, setName] = useState(""); // Nombre de la persona
  const [filters, setFilters] = useState([]); // Filtros de la persona
  const [tags, setTags] = useState({}); // Tags para cada filtro
  const [categories, setCategories] = useState([]); // Categorías de filtros
  const [openModal, setOpenModal] = useState(false); // Controlar la visibilidad del modal
  const [currentFilterId, setCurrentFilterId] = useState(null); // ID del filtro que se está editando
  const [newTag, setNewTag] = useState(""); // Tag nuevo para añadir

  // Fetch de las categorías y filtros agrupados
  useEffect(() => {
    const fetchGroupedFilters = async () => {
      try {
        const response = await axios.get("/filters/grouped"); // Obtener los filtros agrupados por categoría
        setCategories(response.data);

        // Inicializar los tags en el estado al hacer fetch
        const initialTags = {};
        response.data.forEach((category) => {
          category.filters.forEach((filter) => {
            initialTags[filter._id] = filter.tags || []; // Asignar los tags de cada filtro al estado
          });
        });
        setTags(initialTags); // Guardar los tags en el estado
      } catch (err) {
        console.error("Error fetching grouped filters:", err);
      }
    };

    if (user) {
      fetchGroupedFilters();
    }
  }, [user]);

  // Manejar el cambio del nombre
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Manejar el cambio de los tags para un filtro
  const handleTagChange = (filterId, tag) => {
    setTags((prevTags) => ({
      ...prevTags,
      [filterId]: tag,
    }));
  };

  // Manejar la selección de filtros
  const handleFilterSelect = (filterId) => {
    if (!filters.includes(filterId)) {
      setFilters([...filters, filterId]);
    }
  };

  // Abrir el modal para añadir tags
  const openTagModal = (filterId) => {
    setCurrentFilterId(filterId);
    setOpenModal(true);
  };

  // Cerrar el modal
  const closeTagModal = () => {
    setOpenModal(false);
    setNewTag(""); // Limpiar el campo del tag
  };

  // Añadir un nuevo tag al filtro seleccionado
  const handleAddTag = () => {
    if (!newTag) return; // No añadir tags vacíos

    setTags((prevTags) => ({
      ...prevTags,
      [currentFilterId]: [
        ...(prevTags[currentFilterId] || []),
        newTag, // Añadir el nuevo tag
      ],
    }));

    setNewTag(""); // Limpiar el campo de tag
    closeTagModal(); // Cerrar el modal
  };

  // Enviar el formulario para añadir la persona
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || filters.length === 0) {
      alert("Por favor, ingresa un nombre y selecciona al menos un filtro.");
      return;
    }

    const personFilters = filters.map((filterId) => ({
      filterId,
      tags: tags[filterId] ? tags[filterId] : [], // Si no hay tag, se guarda un array vacío
    }));

    try {
      const response = await axios.post("/saved-people", {
        name,
        filters: personFilters,
      });

      alert("Persona añadida correctamente.");
      setName(""); // Limpiar el nombre
      setFilters([]); // Limpiar los filtros seleccionados
      setTags({}); // Limpiar los tags
    } catch (err) {
      console.error("Error adding person:", err);
      alert("Error al añadir la persona.");
    }
  };

  return (
    <div>
      <h1>Añadir persona</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de la persona:</label>
          <input type="text" value={name} onChange={handleNameChange} required />
        </div>

        <div>
          <h3>Selecciona los filtros por categoría</h3>
          {categories.map((category) => (
            <div key={category._id}>
              <h4>{category.name}</h4>
              {category.filters.map((filter) => (
                <div key={filter._id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.includes(filter._id)}
                      onChange={() => handleFilterSelect(filter._id)}
                    />
                    {filter.name}
                  </label>

                  {filters.includes(filter._id) && (
                    <div>
                      <button type="button" onClick={() => openTagModal(filter._id)}>
                        Ver Tags y Añadir
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button type="submit">Añadir Persona</button>
      </form>

      {/* Modal para añadir un tag */}
      {openModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Añadir Tag para {categories
              .flatMap((category) => category.filters)
              .find((filter) => filter._id === currentFilterId)?.name}</h3>
            <div>
              <label>Nuevo Tag:</label>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Introduce un tag"
              />
            </div>
            <button type="button" onClick={handleAddTag}>
              Añadir Tag
            </button>
            <button type="button" onClick={closeTagModal}>
              Cerrar
            </button>

            <div>
              <h4>Tags existentes:</h4>
              <ul>
                {(tags[currentFilterId] || []).map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPerson;