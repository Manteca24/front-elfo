import ProductCard from "../components/ProductCard/ProductCard";
import { Link } from "react-router-dom";
import "../App.css"

const Home = ({ data, error }) => {
    if (error) {
      return <p style={{ color: "red" }}>{error}</p>;
    }
  
    return (
      <div className="dashboard">
        <div className="logoContainer">
            <img src="/logo1.png" alt="Elfo Logo" className="logo" />
          </div>

          <div className="sloganContainer">
            <p className="slogan">Piensa en ellos, los elfos harán el resto</p>
          </div>

          <div className="landing-description">
            <p>
              Elfo es una red social donde podrás compartir y encontrar regalos personalizados. 
              Sube tus regalos y conviértete en la inspiración de miles de personas que saben 
              muchísimas cosas sobre la persona a la que quieren regalar pero no saben qué regalarle 
              en un día especial. Navega entre los regalos que han subido otros elfos y habla con ellos 
              hasta encontrar el regalo perfecto.
            </p>
          </div>

          <div className="buttonsContainer">
            <Link to="/register" className="button">Quiero convertirme en Elfo</Link>
            {/*+botones?botón más grande con otro estilo? pendiente diseño*/}
          </div>

        <ProductCard />
      </div>
    );
  };
  
  export default Home;
  