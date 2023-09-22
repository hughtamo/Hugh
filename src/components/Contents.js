import React from "react";
import styles from "./Contents.module.scss";
import MessageList from "./MessageList";
import Form from "./Form";
import logo from "../logo.svg";
import RemoteTextFetcher from "./RemoteTextFetcher";

const Contents = ({ chatId }) => {
  if (!chatId) {
    return (
      <div className={styles.contents}>
        <div className={styles.center}>
          <RemoteTextFetcher></RemoteTextFetcher>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.contents}>
      <MessageList chatId={chatId} />
      <Form chatId={chatId} />
    </div>
  );
};

export default Contents;