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

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className={Styles.userProfile}>
      <h2>{user.username}</h2>
      <img
        src={user.profilePicture || "/elfoProfile.png"}
        alt={`Profile of ${user.username}`}
        className={Styles.profilePic}
      />
      <div className={Styles.userData}>
        <p>
          <strong>Miembro desde:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Bio:</strong> {user.bio ? `"${user.bio}"` : "Not available"}
        </p>
        <p>
          <strong>Fecha de nacimiento:</strong>{" "}
          {user.birthday
            ? new Date(user.birthday).toLocaleDateString()
            : "Not specified"}
        </p>
        <p>
          <strong>Estado del usuario:</strong>{" "}
          <span
            className={
              user.status === "active"
                ? Styles.status + " " + Styles.statusActive
                : user.status === "banned"
                ? Styles.status + " " + Styles.statusBanned
                : Styles.status + " " + Styles.statusInactive
            }
          >
            {user.status === "active"
              ? "🟢 Active"
              : user.status === "banned"
              ? "🔴 Banned"
              : "🟡 Inactive"}
          </span>
        </p>
        <p>
          <strong>Rol:</strong>{" "}
          {user.isAdmin ? (
            <span className={Styles.admin}>Admin 🛠️</span>
          ) : (
            "Elfo"
          )}
        </p>
      </div>
    </div>
  );
};

export default User;
