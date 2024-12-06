import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import LogoutButton from "../../components/LogOutButton";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Para formatear la fecha
//styles
import { useNavigate } from "react-router-dom";
import Styles from "./Profile.module.css";
import "../../styles/comments.css";
import "../../styles/buttons.css";
import "../../styles/modalWindows.css";
import GiveAPresent from "../../components/GiveAPresent/GiveAPresent";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [savedPeople, setSavedPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Fetch inicial para cargar las personas guardadas
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
        // Actualizar en el backend
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

        // Actualizar estado local
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

  // Eliminar un tag de una persona guardada
  const handleRemoveTag = async (personId, filterId, tagToRemove) => {
    try {
      // Actualizar en el backend
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

      // Actualizar estado local
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
      // Actualizar también selectedPerson para reflejar el cambio en el modal
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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `/comments/user/${user.user.firebaseUid}`
        );
        console.log(data);
        setComments(data);
      } catch (error) {
        console.error("Error fetching user comments:", error);
      }
    };

    if (user) {
      fetchComments();
    }
  }, [user]);

  const handleRemoveFilter = async (personId, filterId) => {
    try {
      // Eliminar el filtro en el backend
      await axios.delete(
        `/users/saved-people/${personId}/filters/${filterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Actualizar el estado local
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

      // Actualizar el estado del modal para reflejar el cambio
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
    return <p>Cargando...</p>;
  }

  return (
    <div className={Styles.profileBody}>
      <h2>Perfil de {user.user.username}</h2>
      {console.log(user)}
      <div className={Styles.buttons}>
        <div className={Styles.logOutButton}>
          <LogoutButton />
        </div>
        {user.user.isAdmin ? (
          <div className={Styles.admin}>
            <button className="greenButton" onClick={() => navigate("/admin")}>
              Panel de admin
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className={Styles.profilePicContainer}>
        <img
          className={Styles.profilePicElfo}
          src={user.user.profilePicture}
          alt="profileImage"
        />
      </div>
      <section className={Styles.myFavorites}>
        <h3>Favoritos</h3>
        {user.user.favoriteProducts.length > 0 ? (
          <ul>
            {console.log(user.user.favoriteProducts)}
            {user.user.favoriteProducts.map((fav, index) => (
              <li key={index}>
                <strong>{fav.product.name}</strong>
                <img src={fav.product.image} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes favoritos guardados.</p>
        )}
      </section>

      <section className={Styles.favoritePeople}>
        <h3>Personas Guardadas</h3>
        {/* Mostrar las personas guardadas */}
        <div className={Styles.savedPeopleContainer}>
          {console.log("savedPeople", savedPeople)}
          {savedPeople.map((person) => (
            <div key={person._id} className={Styles.savedPersonContainer}>
              <div
                className={Styles.clickeableDiv}
                onClick={() => handleOpenTagsModal(person)}
              >
                <h4>{person.name}</h4>
                <img className={Styles.savedPersonImg} src="/savedPerson.png" />
              </div>
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
                          handleAddTag(
                            e,
                            selectedPerson._id,
                            filter.filterId._id
                          )
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
      </section>

      <section className="comments-section">
        {/* {console.log(comments)}  */}
        <h3>Comentarios de {user.user.username}</h3>
        {comments.length > 0 ? (
          <ul className="comment-list">
            {comments.map(
              (
                comment /**si algo da error poner en key {index} porque comment._id tmb es key del comentario en el producto*/
              ) => (
                <li className="comment-item" key={comment._id}>
                  <div className="comment-header">
                    <img
                      src={user.user.profilePicture}
                      alt="foto de perfil"
                      className="profile-pic"
                    />
                    <div className="comment-info">
                      <div className="userInfo">
                        <p>{user.user.username}</p>
                        {user.user.isAdmin ? (
                          <span className="isAdmin">(Admin)</span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="comment-date">
                        {moment(comment.createdAt).format("DD/MM/YYYY HH:mm")}
                      </div>
                    </div>
                  </div>
                  <div className={Styles.commentContent}>
                    <p className={Styles.commentText}>{comment.comment}</p>
                    <p className={Styles.fromProduct}>
                      En:
                      <span>
                        <Link to={`/product/${comment.productId._id}`}>
                          {comment.productId.name}
                        </Link>
                      </span>
                    </p>
                  </div>
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No has dejado comentarios.</p>
        )}
      </section>
    </div>
  );
};

export default Profile;
