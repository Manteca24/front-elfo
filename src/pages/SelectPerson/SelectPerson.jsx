import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./SelectPerson.css";
import { UserContext } from "../../contexts/UserContext";
import AddPerson from "../../components/AddPerson";

const SelectPerson = () => {
  const [savedPeople, setSavedPeople] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedPerson, setSelectedPerson] = useState(null); 
  const { user } = useContext(UserContext); 

  // Fetch inicial para cargar las personas guardadas
  useEffect(() => {
    const fetchSavedPeople = async () => {
      try {
        const response = await axios.get(`/users/saved-people/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setSavedPeople(response.data);
      } catch (err) {
        console.error("Error fetching saved people:", err);
      }
    };
    if (user) {
      fetchSavedPeople();
    }
  }, [user]);

  // Abrir el modal para gestionar tags de una persona
  const handleOpenTagsModal = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  // Añadir un nuevo tag a una persona guardada
  const handleAddTag = async (e, personId, filterId) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTag = e.target.value.trim();
      try {
        // Petición PUT para añadir el tag
        await axios.put(`/users/saved-people/${personId}/filters/${filterId}/tags`, {
          tags: [...selectedPerson.tags, newTag],
        });

        // Actualizar estado local
        setSavedPeople((prevPeople) =>
          prevPeople.map((person) =>
            person._id === personId ? { ...person, tags: [...person.tags, newTag] } : person
          )
        );
        e.target.value = ""; 
      } catch (err) {
        console.error("Error adding tag:", err);
      }
    }
  };

  // Eliminar un tag de una persona guardada
  const handleRemoveTag = async (personId, filterId, tagToRemove) => {
    try {
      // Petición PUT para eliminar el tag
      await axios.put(`/users/saved-people/${personId}/filters/${filterId}/tags`, {
        tags: selectedPerson.tags.filter((tag) => tag !== tagToRemove),
      });

      // Actualizar estado local
      setSavedPeople((prevPeople) =>
        prevPeople.map((person) =>
          person._id === personId ? { ...person, tags: person.tags.filter((tag) => tag !== tagToRemove) } : person
        )
      );
    } catch (err) {
      console.error("Error removing tag:", err);
    }
  };

  const handleRegalar = async (personId) => {
    try {
      const response = await axios.get(`/search/person/${personId}`);
      const products = response.data;
      console.log('Productos encontrados:', products);
      // Aquí puedes hacer lo que quieras con los productos, como mostrarlos en la UI.
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  };

  return (
    <div>
      <h1>Gestionar personas guardadas y sus tags</h1>

      {/* Mostrar las personas guardadas */}
      <div className="saved-people-container">
        {console.log('savedPeople', savedPeople)}
        {savedPeople.map((person) => (
          <div key={person._id} className="saved-person-container">
            <h3>{person.name}</h3>
            <p>Tags: {person.filters.map((filter) => filter.tags.join(", ")).join("; ")}</p>
            <button onClick={() => handleOpenTagsModal(person)}>Gestionar tags</button>
            <button onClick={() => handleRegalar(person._id)}>Regalar</button>
          </div>
        ))}
      </div>

      {/* Modal para gestionar tags */}
      {isModalOpen && selectedPerson && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar tags para {selectedPerson.name}</h2>
            <div>
              {selectedPerson.filters.map((filter) => (
                <div key={filter.filterId}>
                  <h3>{filter.filterId.name}</h3>
                  <ul>
                    {filter.tags.map((tag, index) => (
                      <li key={index}>
                        {tag}{" "}
                        <button onClick={() => handleRemoveTag(selectedPerson._id, filter.filterId._id, tag)}>Eliminar</button>
                      </li>
                    ))}
                  </ul>
                  <input
                    type="text"
                    placeholder="Añadir tag"
                    onKeyDown={(e) => handleAddTag(e, selectedPerson._id, filter.filterId._id)}
                  />
                </div>
              ))}
            </div>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
      {/*Añadir persona*/}
      <AddPerson />
    </div>
  );
};

export default SelectPerson;