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

  const analyzeSentiment = async () => {
    let negativeDetected = false;
    try {
      const response = await fetch("/analyze", {
        method: "POST",
        headers: {
          "X-NCP-APIGW-API-KEY-ID": "dccf90og0v",
          "X-NCP-APIGW-API-KEY": "BQWozJDCXeZ6FxU2s1sEKj76hPml0ZtHYXvWPStR",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: contents }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.document && data.document.sentiment === "negative") {
          // Trigger an alert for negative sentiment
          negativeDetected = true;
          alert("부정적 메세지가 확인되었습니다! ");
        }
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
    if (!negativeDetected) {
      mutation();
      console.log("mutation called?");
    }
  };

  return (
    <div className={styles.form}>
      <label>GPT</label>
      <div id="gptzone">
        <ChatGPT></ChatGPT>
      </div>
      <TextField
        onChange={(e) => {
          setContents(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setContents("");
            analyzeSentiment();
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
              <Icon className={styles.sendButton}>send</Icon>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default Form;
