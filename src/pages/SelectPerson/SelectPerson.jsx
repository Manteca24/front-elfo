import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import GiveAPresent from "../../components/GiveAPresent/GiveAPresent";
import Styles from "./SelectPerson.module.css";
import AddPerson from "../../components/AddPerson/AddPerson";

const SelectPerson = () => {
  const [savedPeople, setSavedPeople] = useState([]);
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [visiblePersonId, setVisiblePersonId] = useState(null);
  const [showAddPerson, setShowAddPerson] = useState(false);

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

  return (
    <div>
      <h2>¿A quién le quieres regalar?</h2>
      {/* Mostrar las personas guardadas */}
      <div className={Styles.savedPeopleContainer}>
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
      {/*Añadir persona*/}
      {/* Button to toggle AddPerson component */}
      <button
        className={Styles.addPersonButton}
        onClick={() => setShowAddPerson(!showAddPerson)}
      >
        <span>+ </span>Añadir Persona
      </button>
      {/* Conditionally render AddPerson component */}
      {showAddPerson && <AddPerson />}{" "}
    </div>
  );
};

export default SelectPerson;
