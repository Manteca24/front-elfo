import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.sections}>
          <div className={styles.links}>
            <a href="/about-us">Sobre Elfo |</a>
            <a href="/rules">Normas |</a>
            <a href="/privacy-policy">Política de privacidad |</a>
          </div>
          <div className={styles.socials}>
            <a
              href="https://www.linkedin.com/in/agozavia/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="data:image/png;base64,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"
                alt="Linkedin"
              />
            </a>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© 2025 Elfo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
