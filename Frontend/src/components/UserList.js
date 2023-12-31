import React, { Fragment, useState } from "react";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import styles from "./UserList.module.scss";
import User from "./User";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const getUsers = gql`
  query {
    users {
      _id
      name
      imageUrl
      online
      role
    }
  }
`;

const newUser = gql`
  subscription {
    newUser {
      _id
      name
      imageUrl
      online
      role
    }
  }
`;

let unsubscribe = null;

const UserList = ({ setChatId }) => {
  const [toggleShowList, setToggleShowList] = useState(false);
  const [keyword, setKeyword] = useState("");
  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <Query query={getUsers}>
      {({ loading, data, subscribeToMore, refetch }) => {
        if (loading) {
          return null;
        }
        if (data) {
          if (!unsubscribe) {
            unsubscribe = subscribeToMore({
              document: newUser,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }
                const { newUser } = subscriptionData.data;
                return {
                  ...prev,
                  users: [...prev.users, newUser],
                };
              },
            });
          }
          refetch();
          const filteredSearchUser = data.users.filter(
            (user) =>
              user.name.indexOf(keyword) !== -1 &&
              user._id !== window.sessionStorage.getItem("id")
          );
          const filteredStudentUser = filteredSearchUser.filter(
            (user) => user.role === "student"
          );
          const filteredParentUser = filteredSearchUser.filter(
            (user) => user.role === "parent"
          );
          const filteredTeacherUser = filteredSearchUser.filter(
            (user) => user.role === "teacher"
          );
          return (
            <Fragment>
              <div
                className={`${styles.list} ${
                  toggleShowList ? styles.show : styles.unshow
                }`}
              >
                <TextField
                  id="standard-dense"
                  label="Search"
                  margin="dense"
                  onChange={handleChange}
                />
                <div className={styles.roleBar}>교사</div>
                {filteredTeacherUser.map((user) => (
                  <User
                    key={user._id}
                    _id={user._id}
                    name={user.name}
                    picture={user.imageUrl}
                    setChatId={setChatId}
                    setToggleShowList={setToggleShowList}
                    online={user.online}
                  />
                ))}
                <div className={styles.roleBar}>학생</div>
                {filteredStudentUser.map((user) => (
                  <User
                    key={user._id}
                    _id={user._id}
                    name={user.name}
                    picture={user.imageUrl}
                    setChatId={setChatId}
                    setToggleShowList={setToggleShowList}
                    online={user.online}
                  />
                ))}
                <div className={styles.roleBar}>학부모</div>
                {filteredParentUser.map((user) => (
                  <User
                    key={user._id}
                    _id={user._id}
                    name={user.name}
                    picture={user.imageUrl}
                    setChatId={setChatId}
                    setToggleShowList={setToggleShowList}
                    online={user.online}
                  />
                ))}
              </div>

              <Icon
                className={styles.toggleShowList}
                fontSize="large"
                color="inherit"
                onClick={() => {
                  setToggleShowList(toggleShowList ? false : true);
                }}
              >
                people
              </Icon>
            </Fragment>
          );
        }
      }}
    </Query>
  );
};

export default UserList;
