import { useState, useContext } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext"; // Importa el contexto
import '../App.css'

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [genre, setGenre] = useState('');
  const [birthday, setBirthday] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext); // Accede a la función setUser
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Registra al usuario en Firebase para obtener el UID
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      let profilePictureUrl = ""; 
      // Si el usuario ha subido una imagen, súbela a Firebase Storage
      if (profilePictureFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${user.firebaseUid}`);
        await uploadBytes(storageRef, profilePictureFile);
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      // Enviar los datos al backend
      const response = await axios.post(
        '/users/user',
        {
          fullName,
          username,
          email,
          password,
          genre,
          birthday,
          bio,
          profilePicture: profilePictureUrl,
          firebaseUid: user.uid
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Usuario registrado en el backend:', response.data);
      setUser({ firebaseUid: user.uid, fullName,
        username,
        email,
        password,
        genre,
        birthday,
        bio,
        profilePicture: profilePictureUrl }); // Actualiza el usuario en el contexto


      navigate("/login");// Redirigir al usuario a la página de inicio de sesión
    } catch (error) {
      console.error('Error al registrar:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>¡Conviértete en elfo!</h1>
        <p>¡Es gratis!</p><p>Únete a nuestra comunidad para compartir y descubrir los mejores regalos personalizados.</p>
        <img src="/elfos.png" alt="Elfo ilustración" className="register-illustration" />
      </div>

      <div className="register-right">
        <h2>Regístrate</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div>
            <label>Nombre Completo:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Género:</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Biografía:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Foto de Perfil:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files[0])} // Guarda el archivo
            />
          </div>
          {error && <p className="register-error">{error}</p>}
          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Registrando...' : 'Regístrate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;