import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./User.module.scss";
import defaultImageUrl from "./default_user.png";

const User = ({ _id, name, picture, setChatId, setToggleShowList, online }) => {
  const [isSwitched, setIsSwitched] = useState(false);

  if (!picture) {
    picture = defaultImageUrl;
  }
  return (
    <div
      style={{ color: isSwitched ? "red" : "#000" }}
      className={styles.user}
      onClick={() => {
        setChatId(_id);
        setToggleShowList(false);
      }}
    >
      <img src={picture} alt="profile" className={styles.imgProfile} />
      <div className={styles.userName}>
        <span>{name}</span>
        <div
          className={styles.statusDot}
          style={{ backgroundColor: online ? "green" : "gray" }}
        ></div>
      </div>
    </div>
  );
};

User.propType = {
  _id: PropTypes.String,
  name: PropTypes.String,
  picture: PropTypes.String,
  onClick: PropTypes.func,
};

User.defaultProps = {
  id: "",
  name: "이름 없음",
  picture: defaultImageUrl,
  onClickUser: () => {
    console.warn("onClick is not define");
  },
};

export default User;
