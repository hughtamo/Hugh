import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import { InputAdornment, TextField, Icon } from "@material-ui/core";
import styles from "./Form.module.scss";
import gql from "graphql-tag";
import ChatGPT from "./ChatGPT";

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

  const handleContentsChange = (e) => {
    setContents(e.target.value);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      setContents("");
      mutation();
    }
  };

  return (
    <div className={styles.form}>
      {/* FormTextField 컴포넌트 */}
      <TextField
        id="outlined-multiline-flexible"
        multiline
        rows={5}
        onChange={handleContentsChange}
        onKeyPress={handleEnterKeyPress}
        value={contents}
        fullWidth={true}
        margin="normal"
        label="Message"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Icon className={styles.sendButton}>send</Icon>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default Form;
