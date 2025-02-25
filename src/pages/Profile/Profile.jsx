import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import LogoutButton from "../../components/LogOutButton";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Styles from "./Profile.module.css";
import "../../styles/comments.css";
import "../../styles/buttons.css";
import "../../styles/modalWindows.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import imageCompression from "browser-image-compression";
import "../../App.css";
import { auth } from "../../config/firebase";
import Spinner from "../../components/Spinner/Spinner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [savedPeople, setSavedPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [favoriteDetails, setFavoriteDetails] = useState([]);
  const [isBioEditable, setIsBioEditable] = useState(false);
  const [favoritesToShow, setFavoritesToShow] = useState(5);
  const [commentsToShow, setCommentsToShow] = useState(5);

  const [formData, setFormData] = useState({
    bio: user.user.bio || "",
    profilePicture: null,
  });
  const [previewImage, setPreviewImage] = useState(
    user.user.profilePicture || ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBioClick = () => {
    setIsBioEditable(true); // Hacer que la bio sea editable
  };

  const handleBioChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, bio: value }));
  };

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

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      try {
        const promises = user.user.favoriteProducts.map(async (fav) => {
          const response = await axios.get(`/products/${fav.product}`);
          return response.data;
        });

        const favorites = await Promise.all(promises);

        setFavoriteDetails(favorites);
      } catch (err) {
        console.error(
          "Error al cargar los detalles de los productos favoritos:",
          err
        );
      }
    };

    if (user?.user?.favoriteProducts?.length > 0) {
      fetchFavoriteDetails();
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

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error al comprimir la imagen:", error);
      alert("No se pudo comprimir la imagen.");
      return null;
    }
  };

  const uploadImageToFirebase = async (file) => {
    const compressedFile = await compressImage(file);
    if (!compressedFile) return null;

    const storageRef = ref(storage, `images/${compressedFile.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, compressedFile);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error al subir la imagen a Firebase:", error);
      alert("No se pudo subir la imagen.");
      return null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      console.log(formData.profilePicture);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleProfileUpdate = async (e) => {
    // e.preventDefault();
    setLoading(true);

    let profilePictureUrl = previewImage;
    if (formData.profilePicture) {
      profilePictureUrl = await uploadImageToFirebase(formData.profilePicture);
      if (!profilePictureUrl) {
        setLoading(false);
        setError("No se pudo subir la imagen.");
        return;
      }
    }
    const updatedUserData = {
      bio: formData.bio,
      profilePicture: profilePictureUrl,
      // agregar aquí más campos si lo veo necesario en el futuro
    };

    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError("No se pudo obtener el usuario.");
      return;
    }

    const token = await user.getIdToken();

    try {
      const response = await axios.put("/users/user", updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setUser(response.data);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <>
      <div className={Styles.profileBody}>
        <h2>Perfil de {user.user.username}</h2>
        <div className={Styles.profileContainer}>
          <div className={Styles.profileLeft}>
            <div className={Styles.profilePicContainer}>
              <div className={Styles.profilePicWrapper}>
                <img
                  className={Styles.profilePicElfo}
                  src={previewImage || user.user.profilePicture} // para ver la previsualización
                  alt="profileImage"
                  onClick={() =>
                    document.getElementById("profileImageInput").click()
                  }
                />
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  style={{ display: "none" }} // El input está oculto y solo se muestra al hacer clic en la imagen
                />
              </div>
            </div>
          </div>

          <div className={Styles.profileRight}>
            <form onSubmit={handleProfileUpdate} className={Styles.profileForm}>
              <label>Biografía:</label>
              {isBioEditable ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleBioChange}
                  onBlur={() => setIsBioEditable(false)} // Guardar cambios cuando el usuario deje de editar
                />
              ) : (
                <p className={Styles.bioText} onClick={handleBioClick}>
                  {formData.bio || "Haz clic para editar tu biografía"}
                </p>
              )}
              <button type="submit" disabled={loading} className="greenButton">
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </div>
          <div className={Styles.buttons}>
            <div className={Styles.logOutButton}>
              <LogoutButton />
            </div>
            {user.user.isAdmin ? (
              <div className={Styles.admin}>
                <button
                  className="greenButton"
                  onClick={() => navigate("/admin")}
                >
                  Panel de admin
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <section className={Styles.myFavorites}>
          <h3>Favoritos</h3>
          {favoriteDetails.length > 0 ? (
            <ul className={Styles.favoriteList}>
              {favoriteDetails.slice(0, favoritesToShow).map((fav, index) => (
                <li className={Styles.favoriteItem} key={index}>
                  <Link
                    to={`/product/${fav._id}`}
                    className={Styles.favoriteLink}
                  >
                    <img src={fav.image} alt={fav.name} />
                    <strong>{fav.name}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes favoritos guardados.</p>
          )}
          {favoriteDetails.length > favoritesToShow && (
            <button
              className="button-more"
              onClick={() => setFavoritesToShow(favoritesToShow + 5)} // Cargar 5 más
            >
              Mostrar más
            </button>
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
                  <img
                    className={Styles.savedPersonImg}
                    src="/savedPerson.png"
                  />
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
          <h3>Comentarios de {user.user.username}</h3>
          {comments.length > 0 ? (
            <ul className="comment-list">
              {comments.slice(0, commentsToShow).map((comment) => (
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
              ))}
            </ul>
          ) : (
            <p>No has dejado comentarios.</p>
          )}
          {comments.length > commentsToShow && (
            <button
              className="button-more"
              onClick={() => setCommentsToShow(commentsToShow + 5)} // Cargar 5 más
            >
              Mostrar más
            </button>
          )}
        </section>
      </div>
    </>
  );
};

export default Profile;
