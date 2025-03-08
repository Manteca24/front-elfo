import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/comments.css";
import moment from "moment";
import Styles from "./ProductDetails.module.css";
import Comment from "../../components/Comment";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [creator, setCreator] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error al cargar el producto:", err);
      }
    };
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchCreator = async () => {
      if (product) {
        try {
          const response = await axios.get(`users/user/${product.user}`);
          setCreator(response.data);
        } catch (err) {
          console.error("Error al cargar el creador:", err);
        }
      }
    };
    fetchCreator();
  }, [product]);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const response = await axios.get(`/comments/product/${id}`);
        setComments(response.data);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      }
      setLoadingComments(false);
    };
    fetchComments();
  }, [id]);

  const handleAddComment = async (e) => {
    // e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/comments/${id}`, {
        comment: newComment,
        firebaseUid: user.user.firebaseUid,
      });

      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error al añadir el comentario:", err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("¿Estás seguro que quieres borrar este comentario?"))
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

  const handleEdit = async (commentId, updatedText) => {
    try {
      await axios.put(
        `/comments/${commentId}`,
        { newComment: updatedText },
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
                comment: updatedText.includes("(editado)")
                  ? updatedText
                  : `${updatedText} (editado)`,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  if (!product) return <p>Cargando producto...</p>;
  if (!creator) return <p>Cargando elfo...</p>;

  return (
    <div className={Styles.productDetailsBody}>
      <div className={Styles.productContainer}>
        {/* Imagen del producto */}
        <div className={Styles.productImage}>
          <img src={product.image} alt={product.name} />
        </div>

        {/* Detalles del producto */}
        <section className={Styles.productDetails}>
          <h2>{product.name}</h2>
          <p>
            Elfo{" "}
            <Link to={`/user/${creator._id}`}>
              <span>@{creator.username}</span>
            </Link>{" "}
            le regaló {product.name} a su <span>{product.relation}</span>
          </p>

          <h4>{creator.username} nos cuenta...</h4>
          <blockquote>"{product.description}"</blockquote>

          <div className={Styles.productInfo}>
            <p>
              <strong>💰 Precio: </strong> {product.price}€
            </p>
            <p>
              <strong>🎂 Edad recomendada: </strong> {product.ageRange}
            </p>
            <p>
              <strong>🧑‍🤝‍🧑 Género: </strong> {product.gender}
            </p>
            <p>
              <strong>🛍 Lugar de compra: </strong>
              {product.purchaseLocation.ubication === "diy"
                ? " ¡Lo hizo con sus propias manos!"
                : `${product.purchaseLocation.ubication} - ${product.purchaseLocation.storeName}`}
            </p>
          </div>

          {product.purchaseLocation.url && (
            <Link
              className={Styles.urlToProduct}
              to={product.purchaseLocation.url}
            >
              Ver producto aquí
            </Link>
          )}

          {/* Tags */}
          <div className={Styles.tags}>
            {product.tags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        </section>
      </div>

      <section className="comments-section">
        <h2>Comentarios</h2>
        {loadingComments ? (
          <p>Cargando comentarios...</p>
        ) : comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))}
          </ul>
        ) : (
          <p>No hay comentarios. ¡Sé el primero en comentar!</p>
        )}

        {user ? (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              rows="4"
              className="comment-input"
            ></textarea>
            <button type="submit" className="greenButton">
              Añadir comentario
            </button>
          </form>
        ) : (
          <p className="logInToComment">
            <Link to="/logIn">
              <span>Inicia sesión</span>
            </Link>{" "}
            para dejar un comentario.
          </p>
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
