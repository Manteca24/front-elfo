import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../contexts/UserContext";
import "../styles/comments.css";

const Comment = ({ comment, handleDelete, handleEdit }) => {
  const { user } = useContext(UserContext);
  const [editingComment, setEditingComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState(comment.comment);

  const handleSave = () => {
    handleEdit(comment._id, newCommentText);
    setEditingComment(false);
  };

  //   console.log("Comentario:", comment);

  return (
    <li className="comment-item">
      <div className="comment-header">
        <Link to={`/user/${comment.userId._id}`}>
          <img
            src={comment.userId.profilePicture || "/elfoProfile.png"}
            alt="Profile"
            className="profile-pic"
          />
        </Link>
        <div className="comment-info">
          <Link to={`/user/${comment.userId._id}`}>
            <div className="userInfo">
              <p>{comment.userId.username}</p>
              {comment.userId.isAdmin && (
                <span className="isAdmin">(Admin)</span>
              )}
            </div>
          </Link>
          <div className="comment-date">
            {moment(comment.createdAt).format("DD/MM/YYYY HH:mm")}
          </div>
        </div>
      </div>

      {editingComment ? (
        <div className="editingComment">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <div className="saveChangesButtons">
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => setEditingComment(false)}>
              Descartar cambios
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="comment-text">{comment.comment}</p>
          {user &&
            (user.user._id === comment.userId._id || user.user.isAdmin) && (
              <div className="comment-actions">
                {/* Show Edit button if the comment is owned by the logged-in user */}
                {comment.userId._id === user.user._id && (
                  <button
                    onClick={() => {
                      setEditingComment(comment._id);
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
        </>
      )}
    </li>
  );
};

export default Comment;
