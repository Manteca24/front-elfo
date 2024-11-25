import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import LogoutButton from "../components/LogOutButton";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useContext(UserContext); // Usamos los datos del contexto
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const response = await axios.get("/products/dashboard");
          setProducts(response.data);
        } catch (err) {
          console.error("Error al cargar los productos:", err);
        }
      }
    fetchProducts();
  }, []);

  if (loading) return <p>Loading profile...</p>;


  return (
    <div>
    {user ? (
        <>
          <h1>Bienvenido, {user.user.username}</h1>
          {console.log(user) /*User es un objeto con un objeto User dentro y otro objeto Prototype con sus métodos.*/}
          <LogoutButton />
          <Link to="/profile">Perfil</Link>
          <div>
            {products.map((product) => (
              <div key={product.id}>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>Cargando usuario...</div>
      )}
    </div>
  );

};

export default Dashboard;