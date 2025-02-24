import React, { useState, useEffect } from "react";
import axios from "axios";
import Styles from "./FilterManager.module.css";
import { Link } from "react-router-dom";
import { formatTag } from "../../utils/formatTag";
import "../../styles/buttons.css";

const FilterManager = () => {
  const [groupedFilters, setGroupedFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [shouldReload, setShouldReload] = useState(false);

  const fetchGroupedFilters = async () => {
    try {
      const response = await axios.get("/filters/grouped");
      setGroupedFilters(response.data);
    } catch (error) {
      console.error("Error cargando filtros agrupados:", error);
    } finally {
      setLoading(false);
    }
  };

  const openTagModal = async (filter) => {
    try {
      const response = await axios.get(`/filters/${filter._id}`);
      console.log(filter._id);
      setSelectedFilter(filter);
      setTags(response.data.tags);
    } catch (error) {
      console.error("Error cargando tags del filtro:", error);
    }
  };

  const addTag = async () => {
    const cleanTag = formatTag(newTag);

    if (cleanTag && !tags.includes(cleanTag)) {
      try {
        const response = await axios.put(
          `/filters/${selectedFilter._id}/tags`,
          {
            tags: [cleanTag],
          }
        );
        setTags(response.data.tags);
        setNewTag("");
        setShouldReload(true);
      } catch (error) {
        console.error("Error añadiendo tag:", error);
      }
    }
  };

  const removeTag = async (tag) => {
    try {
      const response = await axios.delete(
        `/filters/${selectedFilter._id}/tags`,
        { data: { tag } } // Enviar como string, no array
      );
      setTags(response.data.filter.tags);
      setShouldReload(true);
    } catch (error) {
      console.error("Error eliminando tag:", error);
    }
  };

  useEffect(() => {
    fetchGroupedFilters();
  }, []);

  // igual que en categories, al modificar reiniciar y mandar alerta
  useEffect(() => {
    if (shouldReload) {
      alert("Tag modificado correctamente.");
      window.location.reload();
    }
  }, [shouldReload]);

  return (
    <div className={Styles.managerBody}>
      <h2>Gestión de Filtros</h2>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        groupedFilters.map((category) => (
          <div key={category._id}>
            <h3>{category.name}</h3>
            <table className={Styles.filterTable}>
              <thead>
                <tr>
                  <th>Nombre del Filtro</th>
                  <th>Número de Tags</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {console.log(category.filters)}
                {category.filters.map((filter) => (
                  <tr key={filter._id}>
                    <td>{filter.name}</td>
                    <td>{filter.tags?.length || 0}</td>
                    <td>
                      <button
                        className="smallButtons"
                        onClick={() => openTagModal(filter)}
                      >
                        Gestionar Tags de {filter.name}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Modal para gestionar tags */}
      {selectedFilter && (
        <div className={Styles.modal}>
          <div className={Styles.modalContent}>
            <h2>Gestionar Tags para {selectedFilter.name}</h2>
            <ul>
              {tags.map((tag, index) => (
                <li key={index}>
                  {tag}
                  <button onClick={() => removeTag(tag)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nuevo tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") addTag();
              }}
            />
            <button onClick={addTag}>Añadir Tag</button>
            <button
              onClick={() => {
                setSelectedFilter(null);
                setTags([]);
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterManager;
