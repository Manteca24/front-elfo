import React from "react";
import GeneralPage from "../components/GeneralPage/GeneralPage";

const PrivacyPolicy = () => {
  const content = (
    <>
      <h5>Política de Privacidad de Elfo</h5>
      <p>
        En <span>Elfo</span>, valoramos tu privacidad y queremos que sepas cómo
        manejamos tus datos. Esta política explica qué información recopilamos,
        cómo la usamos y qué derechos tienes sobre ella.
      </p>

      <span>1. Datos que recopilamos</span>
      <p>
        Podemos recopilar los siguientes datos cuando usas <span>Elfo</span>:
      </p>
      <p>
        <span>Datos básicos:</span> Nombre, correo electrónico y otra
        información opcional que proporciones.
      </p>
      <p>
        <span>Contenido subido:</span> Información sobre los regalos que
        compartes en la plataforma.
      </p>
      <p>
        <span>Datos técnicos:</span> Dirección IP, tipo de navegador y detalles
        sobre tu actividad en la plataforma.
      </p>

      <span>2. Cómo usamos tus datos</span>
      <p>Utilizamos esta información para:</p>
      <p>
        - Gestionar tu cuenta y mejorar la experiencia en <span>Elfo</span>.
      </p>
      <p>- Mostrar y organizar los regalos que suben los usuarios.</p>
      <p>- Analizar el uso de la plataforma para mejorar nuestros servicios.</p>

      <span>3. Compartición de datos</span>
      <p>
        En <span>Elfo</span>, no vendemos tu información personal. Solo
        compartimos datos con:
      </p>
      <p>
        <span>Proveedores de servicios:</span> Herramientas que nos ayudan a
        operar la plataforma, como servicios de hosting o análisis web.
      </p>
      <p>
        <span>Autoridades legales:</span> En caso de que sea necesario por
        requerimientos legales.
      </p>

      <span>4. Seguridad y retención de datos</span>
      <p>
        Tomamos medidas para proteger tu información, pero recuerda que ninguna
        plataforma en línea es 100% segura. Si eliminas tu cuenta, borraremos
        tus datos salvo que debamos conservarlos por razones legales.
      </p>

      <span>5. Tus derechos</span>
      <p>
        Puedes solicitar acceso, corrección o eliminación de tus datos en
        cualquier momento escribiéndome por
        <a
          href="https://www.linkedin.com/in/agozavia/"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          Linkedin
        </a>
        .
      </p>

      <span>6. Cambios en esta política</span>
      <p>
        Podemos actualizar esta política y te avisaremos si hay cambios
        importantes.
      </p>

      <span>7. Contacto</span>
      <p>
        Si tienes dudas, contáctame en{" "}
        <a
          href="https://www.linkedin.com/in/agozavia/"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          Linkedin
        </a>
        .
      </p>

      <p>
        ¡Gracias por ser parte de <span>Elfo</span>!
      </p>
    </>
  );

  return <GeneralPage title="Política de privacidad" content={content} />;
};

export default PrivacyPolicy;
