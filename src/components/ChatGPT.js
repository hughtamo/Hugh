import { TextField, Button } from "@material-ui/core";
import React, { useState } from "react";
import Swal from "sweetalert2";

function ChatGPT(props) {
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [showResponse, setShowResponse] = useState(false); // 답변을 보일지 여부를 관리하는 상태 추가
  const api_key = process.env.REACT_APP_OPENAI_API_KEY; // <- API KEY 입력

  const summary = props.summary;
  console.log(summary);

  const copyToClipboard = () => {
    if (responseText) {
      // 텍스트를 클립보드에 복사
      navigator.clipboard
        .writeText(responseText)
        .then(() => {
          // 복사 성공 시 처리
          Swal.fire({
            icon: "success",
            title: "복사 완료",
            html: "답변이 클립보드에 복사되었습니다.",
            confirmButtonText: "OK",
          });
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
        content:
          "학생의 문의사항 <" +
          summary +
          ">에 대한 답변을 생성해줘. <" +
          keywords +
          "> 내용을 토대로 답변을 생성해줘. 답변의 앞뒤에 친절한 인삿말과 끝맺음말을 추가해줘. 원래 내가 쓴 답변을 다시 출력해줄 필요는 없어. 마지막으로 <" +
          summary +
          ">에 해당하는 내용이 무엇인지 정리해서 '문의 주신 내용은 다음과 같습니다. 1. 2. ...' 형식으로 먼저 소개해주고, 그 뒤에 질문에 대한 답변을 작성해줘.",
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
      setShowResponse(true); // 답변을 보이도록 설정
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const toggleResponse = () => {
    setShowResponse(!showResponse); // 답변을 토글하는 함수
    if (!showResponse) {
      // 답변이 보이는 상태에서 답변 접기 버튼을 클릭하면 답변을 숨김
      setResponseText("");
    }
  };

  return (
    <div>
      <TextField
        style={{ width: "70%" }}
        id="standard-multiline-static"
        multiline
        rows={3}
        variant="standard"
        type="text"
        name="keywords"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <br />
      <br />
      {showResponse ? ( // 답변을 보이는 경우
        <Button
          variant="contained"
          color="primary"
          onClick={toggleResponse} // 답변 접기 버튼을 클릭하면 답변을 숨김
        >
          답변 접기
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleChatGPT}>
          답변 생성
        </Button>
      )}
      <Button
        style={{ margin: "3px" }}
        variant="contained"
        color="primary"
        onClick={copyToClipboard}
      >
        답변 복사
      </Button>
      {loading && (
        <div id="loading">답변 생성 중입니다. 잠시만 기다려주세요...</div>
      )}

      {showResponse && (
        <div id="result">
          <pre>{responseText}</pre>
        </div>
      )}
    </div>
  );
}
export default ChatGPT;
