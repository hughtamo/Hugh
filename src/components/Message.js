import React from "react";
import PropTypes from "prop-types";
import styles from "./Message.module.scss";
import getTimeString from "../library/getTimeString";
import Summarize from "./Summary";

const Message = ({ me, time, children }) => {
  // 받은 메시지인 경우에만 요약 버튼을 생성
  const isReceivedMessage = !me;
  // 클래스 이름에 따라 요약 버튼을 생성할지 결정
  const shouldRenderSummarizeButton = isReceivedMessage
    ? styles.receivedMessage
    : styles.sentMessage;
  return (
    <div className={shouldRenderSummarizeButton}>
      <div className={me ? styles.sentMessageBox : styles.receivedMessageBox}>
        {children}
      </div>
      <div className={styles.time}>
        {getTimeString(time)}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {isReceivedMessage && <Summarize data={children}></Summarize>}
      </div>
    </div>
  );
};

Message.propType = {
  me: PropTypes.bool,
  // date: PropTypes.number
  time: PropTypes.number,
  children: PropTypes.node,
};

export default Message;
