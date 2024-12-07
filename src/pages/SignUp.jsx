import { useState, useContext, useEffect } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import imageCompression from "browser-image-compression";
import "../App.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    username: "",
    gender: "",
    birthday: "",
    bio: "",
    profilePicture: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { email, password, profilePicture, ...rest } = formData; //REST???
      console.log(formData);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      // Subir imagen a Firebase Storage y obtener la URL
      let profilePictureUrl = null;
      if (profilePicture) {
        profilePictureUrl = await uploadImageToFirebase(profilePicture);
      }

      console.log(rest);
      const userData = {
        ...formData,
        profilePicture: profilePictureUrl,
        firebaseUid: user.uid,
      };
      console.log(userData);
      const response = await axios.post("/users/user", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Usuario registrado en el backend:", response.data);
      setUser({ firebaseUid: user.uid, ...userData });

      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>¡Conviértete en elfo!</h1>
        <p>
          Únete a nuestra comunidad para compartir y descubrir los mejores
          regalos personalizados.
        </p>
        <img
          src="/elfos.png"
          alt="Elfo ilustración"
          className="register-illustration"
        />
      </div>

      <div className="register-right">
        <h2>Regístrate</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div>
            <label>Nombre Completo:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Género:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="no-binario">No binario</option>
              <option value="prefiero-no-decirlo">Prefiero no decirlo</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Biografía:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Subir imagen:</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
          </div>
          {previewImage && (
            <div className="image-preview">
              <img
                src={previewImage}
                alt="Vista previa"
                style={{ maxWidth: "40%", maxHeight: "200px" }}
              />
            </div>
          )}
          {error && <p className="register-error">{error}</p>}
          <button type="submit" disabled={loading} className="button">
            {loading ? "Registrando..." : "Regístrate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
