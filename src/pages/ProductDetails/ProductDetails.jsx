import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/comments.css";
import moment from "moment";
import Styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [creator, setCreator] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);

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

  if (!product) return <p>Cargando producto...</p>;
  if (!creator) return <p>Cargando elfo... </p>;

  return (
    <div className={Styles.productDetailsBody}>
      {/* {console.log(comments)} */}
      <h2>{product.name}</h2>
      <div className={Styles.productImage}>
        {/* {console.log(product)} */}
        <img src={product.image} alt={product.name} />
      </div>
      <section className={Styles.productDetails}>
        <p>
          Elfo <span>@{creator.username}</span> le regaló{" "}
          {/*idea: al pinchar usuario te lleva a tu perfil*/}
          <span>{product.name} </span>a su <span>{product.relation}</span>
        </p>
        <h4>{creator.username} nos cuenta... </h4>
        <p>"{product.description}"</p>
        <h4>Precio: </h4>
        <p>{product.price}€</p>
        <h4>Edad de la persona a la que se lo regaló: </h4>
        <p>{product.ageRange}</p>
        <h4>Género de la persona a la que se lo regaló: </h4>
        <p>{product.gender}</p>
        <h4>Lugar donde lo compró: </h4>
        <p>
          {product.purchaseLocation.ubication === "diy"
            ? "¡Lo hizo con sus propias manos!"
            : product.purchaseLocation.ubication}{" "}
          - {product.purchaseLocation.storeName}
        </p>
        {product.purchaseLocation.url ? (
          <Link
            className={Styles.urlToProduct}
            to={product.purchaseLocation.url}
          >
            Producto disponible en <span>este</span> enlace.
          </Link>
        ) : (
          ""
        )}

        <p className={Styles.tags}>
          {product.tags.map((tag, index) => (
            <p key={index}>#{tag} </p>
          ))}
        </p>
      </section>
      <section className="comments-section">
        <h2>Comentarios</h2>
        {loadingComments ? (
          <p>Cargando comentarios...</p>
        ) : comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment._id} className="comment-item">
                <div className="comment-header">
                  <img
                    src={comment.userId.profilePicture}
                    alt="Foto de perfil"
                    className="profile-pic"
                  />
                  <div className="comment-info">
                    <div className="userInfo">
                      <p>{comment.userId.username}</p>
                      {comment.userId.isAdmin ? (
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
                <p className="comment-text">{comment.comment}</p>
              </li>
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
            <button type="submit" className="submit-button">
              Añadir comentario
            </button>
          </form>
        ) : (
          <p>Inicia sesión para dejar un comentario.</p>
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
