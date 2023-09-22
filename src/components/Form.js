import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import { InputAdornment, TextField, Icon } from "@material-ui/core";
import styles from "./Form.module.scss";
import gql from "graphql-tag";
import ChatGPT from "./ChatGPT";
import FormComponent from "./FormComponent";

const sendMessage = gql`
  mutation sendMessage(
    $senderId: String!
    $receiverId: String!
    $contents: String!
    $time: Date!
  ) {
    sendMessage(
      senderId: $senderId
      receiverId: $receiverId
      contents: $contents
      time: $time
    ) {
      senderId
      receiverId
      contents
      time
    }
  }
`;

const Form = ({ chatId }) => {
  const [contents, setContents] = useState("");
  const mutation = useMutation(sendMessage, {
    variables: {
      senderId: window.sessionStorage.getItem("id"),
      receiverId: chatId,
      contents,
      time: new Date(),
    },
  });

  const [showForm, setShowForm] = useState(false);

  const handleFormButtonClick = () => {
    setShowForm(!showForm);
  };

  return (
    <div className={styles.form}>
      <TextField
        onChange={(e) => {
          setContents(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setContents("");
            mutation();
          }
        }}
        value={contents}
        fullWidth={true}
        margin="normal"
        label="Message"
        placeholder="Type your message."
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <button id="form" onClick={handleFormButtonClick}>
                {showForm ? "Hide Form" : "Show Form"}
              </button>
              <Icon className={styles.sendButton}>send</Icon>
            </InputAdornment>
          ),
        }}
      />
      {showForm && <FormComponent />}
    </div>
  );
};

export default Form;
