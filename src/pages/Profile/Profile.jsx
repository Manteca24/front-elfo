import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import LogoutButton from "../../components/LogOutButton";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from 'moment'; // Para formatear la fecha
//styles
import Styles from "./Profile.module.css"
import "../../styles/comments.css"
import "../../styles/buttons.css"



const Profile = () => {
  const { user, loading } = useContext(UserContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/comments/user/${user.user.firebaseUid}`);
        console.log(data)
        setComments(data);
      } catch (error) {
        console.error("Error fetching user comments:", error);
      }
    };

    if (user) {
      fetchComments();
    }
  }, [user]);


  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className={Styles.profileBody}>
      <h1>Perfil de {user.user.username}</h1>
      {console.log(user)}
      <div className={Styles.logOutButton}><LogoutButton /></div>
      {user.user.isAdmin ? (
        <div className={Styles.adminPanelLink}><Link to="/admin">Panel de admin</Link></div>)
        : (<div></div>)}
      <img className={Styles.profilePicElfo} src={user.user.profilePicture} alt="profileImage" />
      <section className={Styles.myFavorites}>
        <h3>Favoritos</h3>
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

      <section className={Styles.favoritePeople}>
        <h3>Personas Guardadas</h3>
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

      <section className="comments-section">
      {/* {console.log(comments)}  */}
        <h3>Comentarios</h3>
        {comments.length > 0 ? (
          <ul className="comment-list">
            {comments.map((comment) => ( /**si algo da error poner en key {index} porque comment._id tmb es key del comentario en el producto*/
              <li className="comment-item" key={comment._id}>
                <div className="comment-header">
                  <img
                    src={user.user.profilePicture}
                    alt="foto de perfil"
                    className="profile-pic" />
                    <div className="comment-info">
                      <div className="userInfo">
                        <p>{user.user.username}</p>
                        {user.user.isAdmin ? <span className="isAdmin">(Admin)</span> : ''}
                      </div>
                      <div className="comment-date">
                        {moment(comment.createdAt).format('DD/MM/YYYY HH:mm')}
                      </div>
                    </div>
                    </div>
                    <div className={Styles.commentContent}>
                      <p className={Styles.commentText}>{comment.comment}</p>
                      <p className={Styles.fromProduct}>En:
                          <span>
                          <Link to={`/product/${comment.productId._id}`}>{comment.productId.name}
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
      </section>
    </div>
  );
};

export default Profile;
