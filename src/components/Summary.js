import React, { useState } from "react";
//import { useMutation } from "react-apollo-hooks";
//import { InputAdornment, TextField, Icon } from "@material-ui/core";
//import styles from "./Form.module.scss";
//import gql from "graphql-tag";
import styles from "./Summary.module.scss";
import ChatGPT from "./ChatGPT";
import { Button } from "@material-ui/core";


function Summarize(messageinput) {
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [showSummary, setShowSummary] = useState(false); 
  const [responseLines, setResponseLines] = useState([]);
  const [generateSummary, setGenerateSummary] = useState(false);
  const [savedSummary, setSavedSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const api_key = process.env.REACT_APP_OPENAI_API_KEY; // <- API KEY 입력

  const inputKeywords = messageinput.data;

  const handleSummarize = async () => {
    setLoading(true);

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "다음 메시지의 문의 내용을 번호 매겨서 핵심을 정리해줘. 인사, 자기소개, 감사인사 등의 내용은 빼줘. 너(ChatGPT)의 시작말과 마무리말도 빼고 딱 정리한 내용만 출력하도록 해. \"메시지의 문의 내용을 번호를 매겨서 정리하겠습니다 (인사와 마무리말은 제외):\" 이 부분도 빼줘. 1. 부터 시작해. 1. 2. 등 각 번호에는 ~ 관련 문의 등 문의 제목 옆에 음슴체를 사용해서 정리해줘. 1. 2. 번 등 같은 번호 안에서는 줄바꿈 절대!! 하지말고 한 줄로 출력해줘." + inputKeywords},
    ];

    const data = {
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      n: 1,
      messages: messages,
    };

    try {
      let responseData = null;

      if (!generateSummary){
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

      responseData = await response.json();
      }

      const lines = responseData
        ? responseData.choices[0].message.content.split('\n')
        : [];

      // 각 줄을 저장할 배열 및 현재 번호 초기화
      let responseLines = [];
      let currentNumber = "";
  
      // 각 줄을 순회하면서 번호를 추출하고 저장합니다.
      for (const line of lines) {
        // 정규식을 사용하여 숫자와 마침표로 시작하는 줄을 찾습니다.
        const match = line.match(/^(\d+\.) (.*)/);
  
        if (match) {
          // 숫자와 마침표로 시작하는 경우, 새로운 번호를 설정하고 줄을 저장합니다.
          currentNumber = match[1];
          responseLines.push(line);
        } else if (currentNumber) {
          // 현재 번호 아래에 포함되는 경우, 이전 번호와 함께 저장합니다.
          responseLines.push(`${currentNumber} ${line}`);
        }
      }
      // setResponseText(responseData.choices[0].message.content);
      // setResponseLines(responseLines); // 각 줄을 저장한 배열을 상태로 설정
      // setSavedSummary(responseData.choices[0].message.content);
      // setShowSummary(!showSummary);
      // setGenerateSummary(!generateSummary);
      // setKeywords(inputKeywords);

      if (!generateSummary) {
        const summary = responseData && responseData.choices
          ? responseData.choices[0].message.content
          : "";
        setSavedSummary(summary);
        setKeywords(inputKeywords);
      }

      setShowSummary(!showSummary);
      setGenerateSummary(!generateSummary);
      
      console.log(savedSummary);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const toggleSummary = () => {
    setShowSummary(!showSummary); // 요약 결과 토글
  };

  return (
    <div>
      <Button onClick={handleSummarize}>요약 보기</Button>
      {loading && (
        <div id="loading">메시지를 요약하는 중입니다. 잠시만 기다려주세요...</div>
      )}
      {showSummary && (
        <div id="result">
          <pre style={styles.pre}>{showSummary ? savedSummary : ""}</pre>
          <br/>
          <Button onClick={toggleSummary}>요약 접기</Button>
        </div>
      )}
      <ChatGPT summary = {savedSummary}></ChatGPT>
    </div>
  );
}

export default Summarize;