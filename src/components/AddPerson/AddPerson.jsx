import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import { auth } from "../../config/firebase";
import Styles from "./AddPerson.module.css";
import ChooseTags from "../ChooseTags/ChooseTags";
import "../../styles/buttons.css";

const AddPerson = () => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [gender, setGender] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [relation, setRelation] = useState("");
  const [customTag, setCustomTag] = useState("");

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

  const handleNameChange = (e) => setName(e.target.value);

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

  const openModal = (filter) => {
    setCurrentFilter(filter);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addTagToFilter = (tag) => {
    setSelectedFilters((prev) => {
      const filterId = currentFilter._id;
      const currentTags = prev[filterId] || [];

      if (currentTags.includes(tag)) {
        return {
          ...prev,
          [filterId]: currentTags.filter((t) => t !== tag),
        };
      }

      return {
        ...prev,
        [filterId]: [...currentTags, tag],
      };
    });
  };
  const handleAddCustomTag = () => {
    if (!customTag.trim()) return;
    setSelectedFilters((prev) => ({
      ...prev,
      [currentFilter._id]: [...(prev[currentFilter._id] || []), customTag],
    }));
    setCustomTag("");
  };

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
    <div className={Styles.container}>
      <div className={Styles.title}>
        <h2>Añadir Persona</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className={Styles.inputGroup}>
          <label>Nombre: </label>
          <input
            className={Styles.nombre}
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>

        {/* Género */}
        <div className={Styles.inputGroup}>
          <label>Género: </label>
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
        <div className={Styles.inputRelation}>
          <label>Relación contigo: </label>
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
            <option value="mascota">Mascota</option>{" "}
          </select>
        </div>

        {/* Rango de edad */}
        <div className={Styles.inputGroup}>
          <label>Rango de Edad: </label>
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

        <ChooseTags
          categories={categories}
          selectedFilters={selectedFilters}
          toggleFilter={toggleFilter}
          openModal={openModal}
          currentFilter={currentFilter}
          showModal={showModal}
          closeModal={closeModal}
          addTagToFilter={addTagToFilter}
          customTag={customTag}
          setCustomTag={setCustomTag}
          handleAddCustomTag={handleAddCustomTag}
        />
        <div className={Styles.savePersonButton}>
          <button className="greenButton" type="submit">
            Guardar Persona
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPerson;
