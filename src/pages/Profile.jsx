import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import LogoutButton from "../components/LogOutButton";
import { Link } from "react-router-dom";


const Profile = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>

      {console.log(user)}
      <LogoutButton />
      <Link to="/admin">Panel de admin</Link> {/*if (user.isAdmin)*/}
      <img src={user.user.profilePicture} alt="profileImage" />
      <h1>Perfil de {user.user.username}</h1>
      <section>
        <h2>Favoritos</h2>
        {user.user.favoriteProducts.length > 0 ? (
          <ul>
            {user.user.favoriteProducts.map((fav, index) => (
              <li key={index}>
                <strong>{fav.title}</strong> - {fav.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes favoritos guardados.</p>
        )}
      </section>

      <section>
        <h2>Personas Guardadas</h2>
        {user.user.savedPeople.length > 0 ? (
          <ul>
            {user.user.savedPeople.map((person, index) => (
              <li key={index}>
                {person.name} ({person.relationship})
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes personas guardadas.</p>
        )}
      </section>

      <section>
      {console.log(user.user.comments)} {/*pendiente traer del back populate*/}
        <h2>Comentarios</h2>
        {user.user.comments.length > 0 ? (
          <ul>
          
            {user.user.comments.map((comment, index) => (
              <li key={index}>
                <p>
                  <strong>Comentario:</strong> {comment.comment}
                </p>
                <p>
                  <small>En: {comment.productName}</small>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No has dejado comentarios.</p>
        )}
      </section>
    </div>
  );
};

export default Profile;
