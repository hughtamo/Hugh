import React, { useState } from "react";
//import { useMutation } from "react-apollo-hooks";
//import { InputAdornment, TextField, Icon } from "@material-ui/core";
//import styles from "./Form.module.scss";
//import gql from "graphql-tag";

function Summarize(messageinput) {
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [setKeywords] = useState("");
  const api_key = process.env.REACT_APP_OPENAI_API_KEY; // <- API KEY 입력

  const keywords = messageinput.data;

  console.log(keywords);

  const handleSummarize = async () => {
    setLoading(true);

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content:
          '다음 메시지의 문의 내용을 번호 매겨서 핵심을 정리해줘. 인사, 자기소개, 감사인사 등의 내용은 빼줘. 너(ChatGPT)의 시작말과 마무리말도 빼고 딱 정리한 내용만 출력하도록 해. "메시지의 문의 내용을 번호를 매겨서 정리하겠습니다 (인사와 마무리말은 제외):" 이 부분도 빼줘. 1. 부터 시작해.' +
          keywords,
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
      <button onClick={handleSummarize}>Summarize</button>

      {loading && <div id="loading">Loading...</div>}

      <div id="result">{responseText && <pre>{responseText}</pre>}</div>
    </div>
  );
}

export default Summarize;
