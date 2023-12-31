import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import styles from "./LoginBox.module.scss";
import Join from "./Join";
import {
  TextField,
  InputAdornment,
  IconButton,
  Icon,
  Button,
  Link,
} from "@material-ui/core";
import { useAlert } from "react-alert";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo-hooks";

const user = gql`
  query ($_id: String!) {
    user(_id: $_id) {
      _id
      password
      name
      role
    }
  }
`;

const userConnectChange = gql`
  mutation ($_id: String!, $online: Boolean!) {
    userConnectChange(_id: $_id, online: $online) {
      _id
      name
      online
    }
  }
`;

const LoginBox = () => {
  const alert = useAlert();
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [showPassword, useShowPassword] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { data } = useQuery(user, {
    variables: {
      _id: id,
    },
  });
  const userConnect = useMutation(userConnectChange, {
    variables: {
      _id: id,
      online: true,
    },
  });

  const handleLogin = () => {
    if (!id) {
      alert.error("ID를 입력해주세요.");
    } else if (!password) {
      alert.error("패스워드를 입력해주세요.");
    } else if (!data.user) {
      alert.error("가입되지 않은 ID입니다.");
    } else {
      if (password === data.user.password) {
        window.sessionStorage.setItem("id", id);
        window.sessionStorage.setItem("name", data.user.name);
        window.sessionStorage.setItem("role", data.user.role);
        userConnect();
        alert.success("로그인 성공!");
        setRedirectToReferrer(true);
      } else {
        alert.error("비밀번호가 틀렸습니다.");
      }
    }
  };
  if (redirectToReferrer || window.sessionStorage.getItem("id")) {
    return <Redirect to={"/"} />;
  }
  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.logo}>
          <img id="logo" alt="logo" src="/logo.png"></img>
        </div>
        <div className={styles.loginBox}>
          <br />
          <TextField
            id="id"
            className={styles.id}
            variant="standard"
            type="text"
            label="ID"
            margin="normal"
            onChange={(e) => {
              setId(e.target.value);
            }}
            value={id}
          />
          <TextField
            id="password"
            className={styles.password}
            variant="standard"
            type={showPassword ? "text" : "password"}
            label="Password"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => useShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Icon>visibility</Icon>
                    ) : (
                      <Icon>visibility_off</Icon>
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          <br />
          <br />
          <Button
            color="primary"
            variant="contained"
            className={styles.button}
            onClick={() => handleLogin()}
          >
            Login
          </Button>
          <br />
          <br />
          <span>Don't have an account? </span>
          <Link onClick={() => setShowJoin(true)} underline="none">
            Create your account
          </Link>
        </div>
        <Join showJoin={showJoin} setShowJoin={setShowJoin} />
      </div>
    </>
  );
};

export default LoginBox;
