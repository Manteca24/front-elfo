import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import AddPerson from "../../components/AddPerson/AddPerson";
import GiveAPresent from "../../components/GiveAPresent/GiveAPresent";
import Styles from "./SelectPerson.module.css";

const SelectPerson = () => {
  const [savedPeople, setSavedPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [visiblePersonId, setVisiblePersonId] = useState(null);

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

  const toggleVisibility = (personId) => {
    setVisiblePersonId((prevId) => (prevId === personId ? null : personId));
  };

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
      const newTag = e.target.value.trim();
      try {
        await axios.put(
          `/users/saved-people/${personId}/filters/${filterId}/tags`,
          {
            tags: [
              ...selectedPerson.filters.find((f) => f.filterId._id === filterId)
                .tags,
              newTag,
            ],
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
                      ? { ...filter, tags: [...filter.tags, newTag] }
                      : filter
                  ),
                }
              : person
          )
        );
        e.target.value = "";
      } catch (err) {
        console.error("Error adding tag:", err);
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
      console.error("Error removing tag:", err);
    }
  };

  return (
    <div>
      <h2>¿A quién le quieres regalar?</h2>

      {/* Mostrar las personas guardadas */}
      <div className={Styles.savedPeopleContainer}>
        {console.log("savedPeople", savedPeople)}
        {savedPeople.map((person) => (
          <div key={person._id} className={Styles.savedPersonContainer}>
            <div
              className={Styles.clickeableDiv}
              onClick={() => toggleVisibility(person._id)}
            >
              <h4>{person.name}</h4>
              <img
                className={`${Styles.savedPersonImg} ${
                  visiblePersonId === person._id ? "down" : "up"
                }`}
                src="/savedPerson.png"
                alt="Toggle"
              />
            </div>
            <div
              className={`${Styles.hiddenPart} ${
                visiblePersonId === person._id ? Styles.visible : ""
              }`}
            >
              <p>
                <span>Relación: </span>
                {person.relation}
              </p>
              <p>
                <span>Palabras clave:</span>
                {person.filters.map((filter, index) => (
                  <div key={index}>
                    <p>
                      <span>· {filter.filterId.name}</span>
                    </p>
                    <p>{filter.tags.join(", ")}</p>
                  </div>
                ))}
              </p>
              <button
                className="smallButtons"
                onClick={() => handleOpenTagsModal(person)}
              >
                Editar
              </button>
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
                  setSelectedPerson(null);
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
              <h2>Editar tags para {selectedPerson.name}</h2>
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
      {/*Añadir persona*/}
      <AddPerson />
    </div>
  );
};

export default SelectPerson;
