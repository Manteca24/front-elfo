import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import ProductCard from "../components/ProductCard/ProductCard";
import "../App.css"
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useContext(UserContext); 
  if (loading) return <p>Cargando página...</p>;


  return (
    <div className="dashboard">
    {user ? (
        <>
        <div className="heroSection">
          {/* {console.log(user) /*User es un objeto con un objeto User dentro y otro objeto Prototype con sus métodos.*/}
            {/* <div className="logoContainer">
              <img src="/logo_invertido.png" alt="Elfo Logo" className="logo" />
            </div>

            <div className="sloganContainer">
              <p className="slogan">Piensa en ellos, los elfos harán el resto</p>
            </div> */}

            <h2 className="welcomeSentence">¿Qué tarea de elfos quieres hacer hoy, {user.user.username}?</h2>
            <div className="buttonsContainer">
              <Link to="/select-gift" className="button">Buscar un regalo</Link>
              <Link to="/upload-gift" className="button">Subir un regalo</Link>
            </div>
        </div>
          <ProductCard />
        </>
      ) : (
        <div>Cargando usuario...</div>
      )}
    </div>
  );

};

export default Dashboard;