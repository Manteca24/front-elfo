import React from "react";
import GeneralPage from "../components/GeneralPage/GeneralPage";

const AboutUs = () => {
  const content = (
    <>
      <p>
        Bienvenidos a Elfo, la plataforma donde encontrar el regalo perfecto se
        vuelve fácil y significativo. Gracias a la colaboración de nuestra
        comunidad, creamos una base de datos llena de inspiración basada en
        experiencias reales.
      </p>
      <p>
        ¿Cómo funciona? Es simple: describe a la persona a la que le hiciste un
        regalo, comparte qué le obsequiaste y cómo fue su reacción. Con cada
        contribución, Elfo crece y ayuda a más personas a encontrar el detalle
        ideal para sorprender a sus seres queridos.
      </p>
      <p>
        💡 Nuestra misión es transformar la manera en que elegimos regalos,
        conectando a las personas con ideas personalizadas y auténticas. Creemos
        que cada regalo cuenta una historia, y queremos ayudarte a escribir la
        mejor.
      </p>
      <p>
        ¡Gracias por ser parte de esta comunidad y por hacer que regalar sea aún
        más especial! 🎉✨
      </p>
    </>
  );

  return <GeneralPage title=" 🎁 Sobre Elfo" content={content} />;
};

export default AboutUs;
