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

  console.log("Comentario:", comment);

  return (
    <li className="comment-item">
      <div className="comment-header">
        <Link to={`/user/${comment.userId._id}`}>
          <img
            src={comment.userId.profilePicture}
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
        <>
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditingComment(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p className="comment-text">{comment.comment}</p>
          {user &&
            (user.user._id === comment.userId._id || user.user.isAdmin) && (
              <div className="comment-actions">
                <button onClick={() => setEditingComment(true)}>Edit</button>
                <button onClick={() => handleDelete(comment._id)}>
                  Delete
                </button>
              </div>
            )}
        </>
      )}
    </li>
  );
};

export default Comment;
