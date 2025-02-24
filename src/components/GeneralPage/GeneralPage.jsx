import React from "react";
import styles from "./GeneralPage.module.css";

const GeneralPage = ({ title, content }) => {
  return (
    <div className={styles.generalPage}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default GeneralPage;
