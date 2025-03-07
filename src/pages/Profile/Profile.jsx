import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import LogoutButton from "../../components/LogOutButton";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Styles from "./Profile.module.css";
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
  const [isBioEditable, setIsBioEditable] = useState(false);

  if (!user || !user.user) {
    return <Spinner />;
  }

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
    setIsBioEditable(true);
  };

  const handleBioChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, bio: value }));
  };

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
      // console.log(formData.profilePicture);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
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
        <div className={Styles.firstLine}>
          <div></div>
          <h2>Mi perfil</h2>
          <div className={Styles.buttons}>
            <LogoutButton />
            {user.user.isAdmin ? (
              <button
                className="greenButton"
                onClick={() => navigate("/admin")}
              >
                Panel de admin
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>

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
              <h3>{user.user.username}</h3>
            </div>
          </div>

          <div className={Styles.profileRight}>
            <form onSubmit={handleProfileUpdate} className={Styles.profileForm}>
              <label htmlFor="bio">Bio:</label>
              {isBioEditable ? (
                <textarea
                  name="bio"
                  id="bio"
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
        </div>

        <div className={Styles.sectionLinks}>
          <Link
            to="/my-favorites"
            className={`${Styles.SquareLink} ${Styles.toFavorites}`}
          >
            <div className={Styles.SquareImage}></div>
            <p className={Styles.SquareText}>Mis favoritos</p>
          </Link>

          <Link
            to="/my-people"
            className={`${Styles.SquareLink} ${Styles.toPeople}`}
          >
            <div className={Styles.SquareImage}></div>
            <p className={Styles.SquareText}>Mis personas</p>
          </Link>

          <Link
            to="/my-comments"
            className={`${Styles.SquareLink} ${Styles.toComments}`}
          >
            <div className={Styles.SquareImage}></div>
            <p className={Styles.SquareText}>Mis comentarios</p>
          </Link>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
};

export default Profile;
