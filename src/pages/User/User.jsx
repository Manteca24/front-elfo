import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Styles from "./User.module.css";

const User = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/user/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Error loading user data.");
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p>Cargando información de usuario...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Usuario no encontrado.</p>;

  return (
    <div className={Styles.userProfile}>
      <h2>{user.username}</h2>
      <img
        src={user.profilePicture}
        alt={`Perfil de ${user.username}`}
        className={Styles.profilePic}
      />
      <p>Email: {user.email}</p>
      <p>Miembro desde: {new Date(user.createdAt).toLocaleDateString()}</p>
      <p>{user.bio ? `"${user.bio}"` : "Bio no disponible."}</p>
    </div>
  );
};

export default User;
