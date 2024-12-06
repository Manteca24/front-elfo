import React from "react";
import styles from "./AddPerson/AddPerson.module.css";

const ChooseTags = ({
  categories,
  selectedFilters,
  toggleFilter,
  openModal,
  currentFilter,
  showModal,
  closeModal,
  addTagToFilter,
  customTag,
  setCustomTag,
  handleAddCustomTag,
}) => {
  return (
    <div className={styles.filtersContainer}>
      <h4>Filtros disponibles:</h4>
      {categories.map((category) => (
        <div key={category._id}>
          <h5>{category.name}</h5>
          {category.filters.map((filter) => (
            <div key={filter._id}>
              <button type="button" onClick={() => toggleFilter(filter._id)}>
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

export default ChooseTags;
