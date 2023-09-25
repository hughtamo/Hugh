import React from "react";
import styles from "./TodoList.module.scss";

const TodoList = ({ showTodo, setShowTodo }) => {
  return (
    <>
      <div
        className={`${styles.backgroundBlack} ${
          showTodo ? styles.show : styles.unShow
        }`}
        onClick={() => {
          setShowTodo(false);
        }}
      />
      <div
        className={`${styles.todoList} ${
          showTodo ? styles.show : styles.unShow
        }`}
      >
        <div className={styles.title}>회원 정보</div>
        <div className={styles.userInfo}>
          <div>이름: {window.sessionStorage.getItem("name")}</div>
          <div>소속: {window.sessionStorage.getItem("role")}</div>
        </div>
      </div>
    </>
  );
};

export default TodoList;
