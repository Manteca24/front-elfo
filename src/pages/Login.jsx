import { useState, useContext } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "../utils/axiosConfig";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import "../App.css";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();

      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("/users/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);

      navigate(from, { replace: true });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error al iniciar sesión. Revisa tus credenciales.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>¡Hola, elfo!</h1>
        <p>Dime quién eres y ¡empezamos!</p>
        <img
          src="/elfo.png"
          alt="Elfo ilustración"
          className="login-illustration"
        />
      </div>

      <div className="login-right">
        <h2>Inicia sesión</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Introduce tu correo"
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Introduce tu contraseña"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={loading} className="button">
            {loading ? "Iniciando sesión..." : "Inicia sesión"}
          </button>
        </form>
        <p className="register-prompt">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/register" className="register-link">
            Regístrate para convertirte en Elfo y empezar a regalar.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
