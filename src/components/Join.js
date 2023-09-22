import React, { useState } from "react";
import styles from "./Join.module.scss";
import {
  TextField,
  Button,
  Icon,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { useAlert } from "react-alert";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo-hooks";

const duplicateCheck = gql`
  query ($_id: String!) {
    duplicateCheck(_id: $_id)
  }
`;

const addUser = gql`
  mutation ($_id: String!, $name: String!, $password: String, $role: String!) {
    addUser(_id: $_id, name: $name, password: $password, role: $role) {
      _id
      name
    }
  }
`;

const Join = ({ showJoin, setShowJoin }) => {
  const alert = useAlert();
  const [isDuplicated, setDuplicated] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [role, setRole] = useState("student"); // 기본 역할 학생으로?

  const { data } = useQuery(duplicateCheck, {
    variables: {
      _id: id,
    },
  });
  const addUserMutation = useMutation(addUser, {
    variables: { _id: id, name, password, role },
  });
  const handleDuplicateCheck = () => {
    console.log(data);
    if (id) {
      if (data.duplicateCheck) {
        setDuplicated(true);
        alert.success("사용 가능한 ID입니다.");
      } else {
        setDuplicated(false);
        alert.error("이미 ID가 존재합니다.");
      }
    } else {
      alert.error("ID를 입력해주세요.");
    }
  };

  const handleDone = () => {
    if (!name) {
      alert.error("이름을 입력하세요.");
    } else if (!id) {
      alert.error("ID를 입력해주세요.");
    } else if (!password || !passwordCheck) {
      alert.error("비밀번호를 입력해주세요.");
    } else if (!isDuplicated) {
      alert.error("중복체크를 하세요.");
    } else if (password !== passwordCheck) {
      alert.error("패스워드가 다릅니다.");
    } else {
      addUserMutation().then(() => {
        setName("");
        setId("");
        setPassword("");
        setPasswordCheck("");
        setShowJoin(false);
        setDuplicated(false);
        alert.success("회원가입이 정상적으로 처리되었습니다.");
      });
    }
  };
  return (
    <>
      <div
        className={`${styles.backgroundBlack} ${
          showJoin ? styles.show : styles.unShow
        }`}
        onClick={() => {
          setShowJoin(false);
        }}
      />
      <div
        className={`${styles.joinBox} ${
          showJoin ? styles.show : styles.unShow
        }`}
      >
        <div className={styles.form}>
          <TextField
            label="Name"
            className={styles.textField}
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <br />
          <TextField
            label="ID"
            className={styles.textField}
            onChange={(e) => {
              setId(e.target.value);
              setDuplicated(false);
            }}
            value={id}
          />
          <Button
            variant="outlined"
            color={isDuplicated ? "primary" : "secondary"}
            className={styles.checkButton}
            onClick={() => {
              handleDuplicateCheck();
            }}
          >
            {isDuplicated ? <Icon>check_circle_outline</Icon> : "Check"}
          </Button>
          <br />
          <TextField
            label="Password"
            type="password"
            className={styles.textField}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          <br />
          <TextField
            label="Password Check"
            type="password"
            className={styles.textField}
            onChange={(e) => {
              setPasswordCheck(e.target.value);
            }}
            value={passwordCheck}
          />
          <br />
          <br />

          <RadioGroup
            aria-label="Role"
            name="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <FormControlLabel
              value="student"
              control={<Radio />}
              label="학생"
            />
            <FormControlLabel
              value="parent"
              control={<Radio />}
              label="학부모"
            />
            <FormControlLabel
              value="teacher"
              control={<Radio />}
              label="교사"
            />
          </RadioGroup>
        </div>
        <br />
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleDone();
          }}
        >
          Create your account
        </Button>
      </div>
    </>
  );
};

export default Join;
