import React, { useState, useEffect } from "react";
import axios from "axios";
import Styles from "./CategoryManager.module.css";
import { Link } from "react-router-dom";
import "../../styles/buttons.css";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", filters: [] });
  const [newFilter, setNewFilter] = useState("");
  const [shouldReload, setShouldReload] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (window.confirm("¿Seguro que quieres eliminar esta categoría?")) {
      try {
        await axios.delete(`/categories/${categoryId}`);
        setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
        setShouldReload(true);
      } catch (error) {
        console.error("Error eliminando categoría:", error);
      }
    }
  };

  const saveCategory = async () => {
    try {
      if (currentCategory) {
        await axios.put(`/categories/${currentCategory._id}`, newCategory);
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === currentCategory._id ? { ...cat, ...newCategory } : cat
          )
        );
      } else {
        const response = await axios.post("/categories", newCategory);
        setCategories((prev) => [...prev, response.data]);
      }

      setShowModal(false);
      setNewCategory({ name: "", filters: [] });
      setCurrentCategory(null);

      setShouldReload(true);
    } catch (error) {
      console.error("Error guardando categoría:", error);
    }
  };

  const openEditModal = (category) => {
    // console.log(category)
    setCurrentCategory(category);
    setNewCategory({
      name: category.name,
      filters: category.filters.map((filter) => filter.name),
    });
    setShowModal(true);
  };

  const addFilter = () => {
    if (
      newFilter.trim() &&
      !newCategory.filters.map((filter) => filter.name).includes(newFilter)
    ) {
      setNewCategory((prev) => ({
        ...prev,
        filters: [...prev.filters, newFilter],
      }));
      setNewFilter("");
    }
  };

  const removeFilter = (filter) => {
    setNewCategory((prev) => ({
      ...prev,
      filters: prev.filters.filter((f) => f !== filter),
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // he eliminado el success message y he puesto una alert, más compatible con el reload
    if (shouldReload) {
      alert("Categoría modificada correctamente.");
      window.location.reload();
    }
  }, [shouldReload]);

  return (
    <div className={Styles.managerBody}>
      <h2>Gestión de Categorías</h2>
      <div className={Styles.newCategoryButtonContainer}>
        <button className="greenButton" onClick={() => setShowModal(true)}>
          Añadir nueva categoría
        </button>
      </div>

      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <table>
          <thead className={Styles.categoryTableHead}>
            <tr className={Styles.categoryTableRows}>
              <th>Nombre</th>
              <th>Filtros</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className={Styles.categoryTableBody}>
            {/* {console.log(categories)} */}
            {categories.map((category) => (
              <tr key={category._id} className={Styles.categoryRow}>
                <td className={Styles.categoryName}>{category.name}</td>
                <td className={Styles.filtersList}>
                  {category.filters.map((filter) => filter.name).join(", ")}
                </td>{" "}
                {/* Mostrar filtros */}
                <td className={Styles.acciones}>
                  <button
                    className="smallButtons"
                    onClick={() => openEditModal(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="smallBadButtons"
                    onClick={() => deleteCategory(category._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para crear o editar categoría */}
      {showModal && (
        <div className={Styles.modal}>
          <div className={Styles.modalContent}>
            {" "}
            {/*styles utiliza camelCase*/}
            <h2>{currentCategory ? "Editar Categoría" : "Nueva Categoría"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCategory();
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  required
                />
              </label>

              {/* Filtros */}
              <h3>Filtros</h3>
              <div className={Styles.filtersInModal}>
                <ul className={Styles.filtersList}>
                  {newCategory.filters.map((filter, index) => (
                    <li key={index}>
                      {filter}{" "}
                      <span
                        onClick={() => removeFilter(filter)}
                        title="Eliminar filtro"
                      >
                        {" "}
                        &times; {/*x*/}
                      </span>
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  value={newFilter}
                  onChange={(e) => setNewFilter(e.target.value)}
                  placeholder="Añadir filtro"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFilter();
                    }
                  }}
                />
                <button type="button" onClick={addFilter}>
                  Añadir
                </button>
              </div>

              <button type="submit">Guardar</button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setNewCategory({ name: "", filters: [] });
                  setCurrentCategory(null);
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
