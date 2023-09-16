import React, { useState } from "react";
//import { useMutation } from "react-apollo-hooks";
//import { InputAdornment, TextField, Icon } from "@material-ui/core";
//import styles from "./Form.module.scss";
//import gql from "graphql-tag";

function ChatGPT() {
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [keywords, setKeywords] = useState("");
  const api_key = "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"; // <- API KEY 입력

  const handleChatGPT = async () => {
    setLoading(true);

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: keywords + "에 대하여 100자 미만으로 짧게 답변해줘.",
      },
    ];

    const data = {
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      n: 1,
      messages: messages,
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + api_key,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      setResponseText(responseData.choices[0].message.content);
      setKeywords("");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        id="keywords"
        name="keywords"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <button onClick={handleChatGPT}>Chat</button>

      {loading && <div id="loading">Loading...</div>}

      <div id="result">{responseText && <pre>{responseText}</pre>}</div>
    </div>
  );
}

export default ChatGPT;
