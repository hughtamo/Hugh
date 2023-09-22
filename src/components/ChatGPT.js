import { TextField, Button } from "@material-ui/core";
import React, { useState } from "react";
//import { useMutation } from "react-apollo-hooks";
//import { InputAdornment, TextField, Icon } from "@material-ui/core";
import styles from "./Form.module.scss";
//import { TextField } from "@material-ui/core";
//import gql from "graphql-tag";
import Summarize from "./Summary";

function ChatGPT(props) {
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [keywords, setKeywords] = useState("");
  const api_key = process.env.REACT_APP_OPENAI_API_KEY; // <- API KEY 입력

  const summary = props.summary;
  console.log(summary);

  const copyToClipboard = () => {
    if (responseText) {
      // 텍스트를 클립보드에 복사
      navigator.clipboard.writeText(responseText)
        .then(() => {
          // 복사 성공 시 처리
          alert("답변이 클립보드에 복사되었습니다.");
        })
        .catch((err) => {
          console.error("클립보드 복사 실패:", err);
        });
    }
  };
  const handleChatGPT = async () => {
    setLoading(true);

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: summary +"는 원래 학생 또는 학부모의 문의사항이고" + keywords + "는 교사인 내가 작성한 간략한 답변인데, 답변을 더 친절하게 인삿말과 끝맺음말을 추가해서 써줘. 원래 내가 쓴 답변을 출력해줄 필요는 없어. 그리고 summary에 해당하는 내용이 뭔지도 정리해서 \"문의주신 내용은 다음과 같습니다. 1. 2. ...\"이런 식으로 먼저 소개해주고 답변을 써주면 좋을 것 같아.",
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
      <TextField style={{width:'70%'}}
        id="standard-multiline-static"
        multiline
        rows={3}
        variant = "standard"
        type="text"
        name="keywords"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        />
        <br/><br/>
      <Button variant="contained" color="primary" onClick={handleChatGPT}>답변 생성</Button>
      <Button style={{margin:'3px'}} variant="contained" color="primary" onClick={copyToClipboard}>
        답변 복사
      </Button>
      {loading && <div id="loading">답변 생성 중입니다. 잠시만 기다려주세요...</div>}

      <div id="result" className={styles.form}>
        {responseText && <pre className={styles.form}>{responseText}</pre>}
      </div>
    </div>
  );
}

export default ChatGPT;
