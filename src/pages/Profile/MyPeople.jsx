import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import Styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import GiveAPresent from "../../components/GiveAPresent/GiveAPresent";

const MyPeople = () => {
  const { user } = useContext(UserContext);
  const [savedPeople, setSavedPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSavedPeople = async () => {
      try {
        const response = await axios.get(`/users/saved-people/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
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

  const handleOpenTagsModal = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  const handleAddTag = async (e, personId, filterId) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTags = e.target.value.trim().split(/\s*,\s*/); // Split by comma or space
      try {
        await axios.put(
          `/users/saved-people/${personId}/filters/${filterId}/tags`,
          {
            tags: [
              ...selectedPerson.filters.find((f) => f.filterId._id === filterId)
                .tags,
              ...newTags,
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        // Optimistically update the local state
        setSavedPeople((prevPeople) =>
          prevPeople.map((person) =>
            person._id === personId
              ? {
                  ...person,
                  filters: person.filters.map((filter) =>
                    filter.filterId._id === filterId
                      ? { ...filter, tags: [...filter.tags, ...newTags] }
                      : filter
                  ),
                }
              : person
          )
        );

        // Update the selected person in the modal as well
        setSelectedPerson((prevSelectedPerson) => {
          if (prevSelectedPerson._id === personId) {
            return {
              ...prevSelectedPerson,
              filters: prevSelectedPerson.filters.map((filter) =>
                filter.filterId._id === filterId
                  ? {
                      ...filter,
                      tags: [...filter.tags, ...newTags],
                    }
                  : filter
              ),
            };
          }
          return prevSelectedPerson;
        });

        e.target.value = ""; // Clear input field after adding tags
      } catch (err) {
        console.error("Error adding tags:", err);
      }
    }
  };

  const handleRemoveTag = async (personId, filterId, tagToRemove) => {
    try {
      await axios.put(
        `/users/saved-people/${personId}/filters/${filterId}/tags`,
        {
          tags: selectedPerson.filters
            .find((f) => f.filterId._id === filterId)
            .tags.filter((tag) => tag !== tagToRemove),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setSavedPeople((prevPeople) =>
        prevPeople.map((person) =>
          person._id === personId
            ? {
                ...person,
                filters: person.filters.map((filter) =>
                  filter.filterId._id === filterId
                    ? {
                        ...filter,
                        tags: filter.tags.filter((tag) => tag !== tagToRemove),
                      }
                    : filter
                ),
              }
            : person
        )
      );
      setSelectedPerson((prevSelectedPerson) => {
        if (prevSelectedPerson._id === personId) {
          return {
            ...prevSelectedPerson,
            filters: prevSelectedPerson.filters.map((filter) =>
              filter.filterId._id === filterId
                ? {
                    ...filter,
                    tags: filter.tags.filter((tag) => tag !== tagToRemove),
                  }
                : filter
            ),
          };
        }
        return prevSelectedPerson;
      });
    } catch (err) {
      console.error("Error removing tag:", message.error);
    }
  };

  const handleRemoveFilter = async (personId, filterId) => {
    try {
      await axios.delete(
        `/users/saved-people/${personId}/filters/${filterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setSavedPeople((prevPeople) =>
        prevPeople.map((person) =>
          person._id === personId
            ? {
                ...person,
                filters: person.filters.filter(
                  (filter) => filter.filterId._id !== filterId
                ),
              }
            : person
        )
      );

      setSelectedPerson((prevSelectedPerson) => ({
        ...prevSelectedPerson,
        filters: prevSelectedPerson.filters.filter(
          (filter) => filter.filterId._id !== filterId
        ),
      }));
    } catch (err) {
      console.error("Error removing filter:", err);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={Styles.peopleContainer}>
      <h2>Mis personas</h2>
      <Link to="/profile" className={Styles.backButton}>
        <svg className={Styles.arrowIcon} viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" /> {/* Left arrow */}
        </svg>
        <h5>Volver al perfil</h5>
      </Link>

      {/* Mostrar las personas guardadas */}
      <div className={Styles.savedPeopleContainer}>
        {/* {console.log("savedPeople", savedPeople)} */}
        {savedPeople.map((person) => (
          <div className={Styles.personCard}>
            <div key={person._id} className={Styles.savedPersonContainer}>
              <div className={Styles.savedPersonWho}>
                <h4>{person.name}</h4>
                <p>
                  <span>Relación: </span>
                  {person.relation}
                </p>
                <div
                  className={Styles.editButtonContainer}
                  onClick={() => handleOpenTagsModal(person)}
                >
                  <p>Modificar características de {person.name}</p>
                  <button className={Styles.editButton} alt="editar"></button>
                </div>
              </div>
              <div className={Styles.elfoImgContainer}>
                <img className={Styles.savedPersonImg} src="/savedPerson.png" />
              </div>
            </div>

            <div className={Styles.cardsButtons}>
              <button
                onClick={() => {
                  setSelectedPerson(person);
                  setShowModal(true);
                }}
                className="smallGoodButtons"
              >
                Regalar
              </button>
            </div>
            {showModal && selectedPerson?._id === person._id && (
              <GiveAPresent
                person={selectedPerson}
                onClose={() => {
                  setShowModal(false);
                  setSelectedPerson(null); // Limpiar la persona seleccionada
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal para gestionar tags */}
      {isModalOpen && selectedPerson && (
        <div className="modal">
          <div className="modalContent">
            <div className="title">
              <h2>Modificar características de {selectedPerson.name}</h2>
            </div>
            <div className="filtersGroup">
              {selectedPerson.filters.map((filter) => (
                <ul className="filtersInModal" key={filter.filterId}>
                  <li className="eachFilter">
                    <span
                      onClick={() =>
                        handleRemoveFilter(
                          selectedPerson._id,
                          filter.filterId._id
                        )
                      }
                    >
                      {filter.filterId.name} &times;
                    </span>

                    <ul className="tags">
                      {filter.tags.map((tag, index) => (
                        <li
                          key={index}
                          className="eachTag"
                          onClick={() =>
                            handleRemoveTag(
                              selectedPerson._id,
                              filter.filterId._id,
                              tag
                            )
                          }
                        >
                          {tag} &times;
                        </li>
                      ))}
                    </ul>
                    <input
                      className="modalInput"
                      type="text"
                      placeholder="Añade un tag y pulsa Enter"
                      onKeyDown={(e) =>
                        handleAddTag(e, selectedPerson._id, filter.filterId._id)
                      }
                    />
                  </li>
                </ul>
              ))}
            </div>
            <div className="modalCloseButton">
              <button className="button" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPeople;
