import React from "react";
import styles from "./Header.module.scss";
import MenuButton from "./MenuButton";
import default_user from "./default_user.png";
import { AppBar } from "@material-ui/core";
const Header = ({ setRedirectToReferrer, setShowTodo }) => {
  return (
    <AppBar className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="/logo.png"></img>
      </div>
      <MenuButton
        className={styles.menuButton}
        setRedirectToReferrer={setRedirectToReferrer}
        setShowTodo={setShowTodo}
      />
      <img
        alt={window.sessionStorage.getItem("name")}
        className={styles.profile}
        src={window.sessionStorage.getItem("imgUrl") || default_user}
      />
    </AppBar>
  );
};

export default Header;
