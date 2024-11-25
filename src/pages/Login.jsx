import { useState, useContext } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      const token = await user.getIdToken();

      // Guarda el token en el localStorage y actualiza axios
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Obtén los datos del usuario desde el backend
      const response = await axios.get('/users/user',
      {headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data); // Actualiza el contexto de usuario

      navigate("/dashboard");

    } catch (err) {
      console.error("Error al iniciar sesión:", error);
      setError("Error al iniciar sesión. Revisa tus credenciales.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Correo electrónico"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Contraseña"
      />
      <button type="submit">Iniciar sesión</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LogIn;