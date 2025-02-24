import React from "react";
import GeneralPage from "../components/GeneralPage/GeneralPage";

const Rules = () => {
  const content = (
    <>
      <ul>
        <li>Respeta a otros usuarios y sus opiniones.</li>
        <li>
          Los contenidos subidos deben ser apropiados y cumplir con la legalidad
          vigente.
        </li>
        <li>No está permitido el spam ni el uso de lenguaje ofensivo.</li>
        <li>Elfo se reserva el derecho de moderar contenidos inapropiados.</li>
      </ul>
      <p>
        Estas normas garantizan una comunidad segura y respetuosa para todos.
        Gracias por cumplirlas.
      </p>
    </>
  );

  return <GeneralPage title="Normas" content={content} />;
};

export default Rules;
