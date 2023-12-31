import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Summary.module.scss";
import ChatGPT from "./ChatGPT";
import { Button } from "@material-ui/core";

function Summarize(messageinput) {
  const [loading, setLoading] = useState(false);
  const [responseLines, setResponseLines] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [generateSummary, setGenerateSummary] = useState(false);
  const [savedSummary, setSavedSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const api_key = process.env.REACT_APP_OPENAI_API_KEY; // <- API KEY 입력

  // 문자열로 변환해서 저장
  const inputKeywords = String(messageinput.data);
  const inputKeywordLines = inputKeywords.split(" ");

  const handleSummarize = async () => {
    setLoading(true);

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content:
          '다음 메시지의 문의 내용을 번호 매겨서 핵심을 정리해줘. 인사, 자기소개, 감사인사 등의 내용은 빼줘. 너(ChatGPT)의 시작말과 마무리말도 빼고 딱 정리한 내용만 출력하도록 해. "메시지의 문의 내용을 번호를 매겨서 정리하겠습니다 (인사와 마무리말은 제외):" 이 부분도 빼줘. 1. 부터 시작해. 1. 2. 등 각 번호에는 ~ 관련 문의 등 문의 제목 옆에 음슴체를 사용해서 정리해줘. 1. 2. 번 등 같은 번호 안에서는 줄바꿈 절대!! 하지말고 한 줄로 출력해줘.' +
          inputKeywords,
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

      if (response.status === 200) {
        const lines = responseData.choices[0].message.content.split("\n");
        setResponseLines(lines);

        if (inputKeywordLines.length >= 5) {
          const summary = lines.join("\n");
          setSavedSummary(summary);
          setKeywords(inputKeywords);
          setShowSummary(true);
          setGenerateSummary(!generateSummary);
        }
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  return (
    <div>
      {inputKeywordLines.length >= 30 && (
        <Button onClick={handleSummarize}>요약 보기</Button>
      )}
      {loading && (
        <div id="loading">
          메시지를 요약하는 중입니다. 잠시만 기다려주세요...
        </div>
      )}
      {showSummary && (
        <div id="result">
          <pre style={{ ...styles.pre, whiteSpace: "pre-wrap" }}>
            {showSummary ? savedSummary : ""}
          </pre>
          <br />
          <Button onClick={toggleSummary}>요약 접기</Button>
        </div>
      )}
      {inputKeywordLines.length >= 30 && (
        <ChatGPT summary={savedSummary}></ChatGPT>
      )}
    </div>
  );
}

export default Summarize;
