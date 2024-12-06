import React from "react";
import Styles from "./ChooseTags.module.css";
import "../../styles/buttons.css";

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
    <div className={Styles.filtersContainer}>
      <div className={Styles.filtersTitle}>
        <h4>Filtros disponibles:</h4>
      </div>
      {categories.map((category) => (
        <div className={Styles.filtersOfCategory} key={category._id}>
          <h5 className={Styles.categoryName}>{category.name}</h5>
          <div className={Styles.listOfFilters}>
            {category.filters.map((filter) => (
              <div className={Styles.filters} key={filter._id}>
                <div className={Styles.filterDiv}>
                  <div
                    className={`${Styles.filter} ${
                      selectedFilters[filter._id] ? Styles.selected : ""
                    }`}
                    onClick={() => toggleFilter(filter._id)}
                  >
                    {selectedFilters[filter._id]
                      ? String.fromCharCode(215)
                      : "+"}{" "}
                    {filter.name}
                  </div>
                  {/* Mostrar solo los filtros seleccionados */}
                  {selectedFilters[filter._id] && (
                    <div className={Styles.lapiz}>
                      <img
                        src="./editar.png"
                        onClick={() => openModal(filter)}
                      />
                      <ul>
                        {selectedFilters[filter._id].map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal de filtro */}
      {showModal && currentFilter && (
        <div className="modal">
          <div className={Styles.modalContent}>
            <h2>{currentFilter.name}</h2>
            <p>
              Especifica un poco más para que podamos encontrar el regalo ideal.
            </p>
            <ul className={Styles.tagList}>
              {currentFilter.tags.map((tag) => (
                <li
                  key={tag}
                  type="button"
                  onClick={() => addTagToFilter(tag)}
                  className={`${Styles.tagButton} ${
                    selectedFilters[currentFilter._id]?.includes(tag)
                      ? Styles.selectedTag
                      : ""
                  }`}
                >
                  {selectedFilters[currentFilter._id]?.includes(tag)
                    ? "- "
                    : "+ "}
                  {tag}
                </li>
              ))}
            </ul>

            {/* Input para tags personalizados */}
            <div className={Styles.inputAddTag}>
              <input
                className={Styles.inputTag}
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Evita que el formulario se envíe
                    handleAddCustomTag();
                  }
                }}
                placeholder="Añade un tag y pulsa Enter"
              />
              <div className={Styles.addTagButton}>
                <button
                  className="greenButton"
                  type="button"
                  onClick={handleAddCustomTag}
                >
                  Añadir Tag
                </button>
              </div>
            </div>
            <div className={Styles.closeModalButton}>
              <button className="button" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseTags;
