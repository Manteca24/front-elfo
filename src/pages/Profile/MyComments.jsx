import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Styles from "./Profile.module.css";
import "../../styles/comments.css";
import "../../styles/buttons.css";
import "../../styles/modalWindows.css";
import "../../App.css";
import moment from "moment";

const MyComments = () => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [commentsToShow, setCommentsToShow] = useState(5);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `/comments/user/${user.user.firebaseUid}`
        );
        // console.log(data);
        setComments(data);
      } catch (error) {
        console.error("Error fetching user comments:", error);
      }
    };

    if (user) {
      fetchComments();
    }
  }, [user]);

  return (
    <div className={Styles.commentsContainer}>
      <h2>Mis comentarios</h2>
      <Link to="/profile" className="back-button">
        Volver al perfil
      </Link>
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
    </div>
  );
};

export default MyComments;
