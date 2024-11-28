import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../App.css" // estilos, pendiente modular?

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [creator, setCreator] = useState("");

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

  useEffect(()=> {
    const fetchCreator = async () => {
      try {
        const response = await axios.get(`users/user/${product.user}`);
        // console.log(response)
        setCreator(response.data);
      } catch (err) {
        console.error("Error al cargar el creador:", err);
      }
    };
    fetchCreator();
  }, [product])

  if (!product) return <p>Cargando producto...</p>;
  if (!creator) return <p>Cargando elfo... </p>;

  return (
    <div>
      {/* {console.log(product)} */}
      <h1>{product.name}</h1>
      <img className="productImage" src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>Precio: {product.price}</p>
      <p>Elfo: {creator.username}</p>
    </div>
  );
};

export default ProductDetails;