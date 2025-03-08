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
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `/comments/user/${user.user.firebaseUid}`
        );
        setComments(data);
      } catch (error) {
        console.error("Error fetching user comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchComments();
    }
  }, [user]);

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await axios.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      await axios.put(
        `/comments/${commentId}`,
        { newComment: newCommentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                comment: newCommentText.includes("(editado)")
                  ? newCommentText
                  : `${newCommentText} (editado)`,
              }
            : comment
        )
      );

      setEditingCommentId(null);
      setNewCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className={Styles.commentsContainer}>
      <h2>Mis comentarios</h2>
      <Link to="/profile" className={Styles.backButton}>
        <svg className={Styles.arrowIcon} viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <h5>Volver al perfil</h5>
      </Link>

      {loading ? (
        <p>Cargando comentarios...</p>
      ) : comments.length > 0 ? (
        <ul className="comment-list">
          {comments.slice(0, commentsToShow).map((comment) => (
            <li className="comment-item" key={comment._id}>
              <div className="comment-header">
                {/* Display the profile picture and username of the comment author */}
                <Link to={`/user/${user.user._id}`}>
                  <img
                    src={user.user.profilePicture || "./elfoProfile.png"}
                    alt="foto de perfil"
                    className="profile-pic"
                  />
                </Link>
                <div className="comment-info">
                  <Link to={`/user/${user.user._id}`}>
                    <div className="userInfo">
                      <p>{user.user.username}</p>
                      {user.user.isAdmin && (
                        <span className="isAdmin">(Admin)</span>
                      )}
                    </div>
                  </Link>
                  <div className="comment-date">
                    {moment(comment.createdAt).format("DD/MM/YYYY HH:mm")}
                  </div>
                </div>
              </div>

              {/* Display the product the comment was made for */}
              <p className={Styles.fromProduct}>
                En:{" "}
                <span>
                  <Link to={`/product/${comment.productId._id}`}>
                    {comment.productId.name}
                  </Link>
                </span>
              </p>

              {/* Editing Mode */}
              {editingCommentId === comment._id ? (
                <div className="editingComment">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <div className="saveChangesButtons">
                    <button onClick={() => handleEdit(comment._id)}>
                      Guardar
                    </button>
                    <button onClick={() => setEditingCommentId(null)}>
                      Descartar cambios
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment-text">{comment.comment}</p>
              )}

              {/* Display the "Edit" and "Delete" buttons */}
              {user &&
                (user.user._id === comment.userId._id || user.user.isAdmin) && (
                  <div className="comment-actions">
                    {/* Show Edit button if the comment is owned by the logged-in user */}
                    {comment.userId === user.user._id && (
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setNewCommentText(comment.comment);
                        }}
                      >
                        <img src="/editpencil.png" alt="Edit" />
                      </button>
                    )}

                    {/* Show Delete button for admins or if the comment is owned by the logged-in user */}
                    {(user.user.isAdmin ||
                      comment.userId._id === user.user._id) && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(comment._id)}
                      >
                        ✖
                      </button>
                    )}
                  </div>
                )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No has dejado comentarios.</p>
      )}

      {comments.length > commentsToShow && (
        <button
          className={Styles.buttonMore}
          onClick={() => setCommentsToShow(commentsToShow + 5)}
        >
          <svg className={Styles.arrowIcon} viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MyComments;
