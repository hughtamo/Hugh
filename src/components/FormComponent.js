import React, { useState } from 'react';
import Summarize from './Summary';

function FormComponent(props) {

  const summaryData = props;
  console.log(summaryData);

  const [showForm, setShowForm] = useState(false); // 폼을 보이게/숨기게 할 상태 추가
  const [summary, setSummary]= useState("");

  const [formData, setFormData] = useState({
    subject: '', // 수강 과목 또는 질문 제목
    question: '', // 학생이 요청한 문의사항
    answer: '', // 문의 사항에 대한 답변
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 폼 데이터를 서버에 제출 또는 처리하는 로직 추가
    console.log(formData); // 예시: 폼 데이터 출력
  };

  return (
    <div>
      {showForm ? ( // "form" 버튼을 클릭하면 폼을 보이게 함
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subject">수강 과목 또는 질문 제목</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="question">학생이 요청한 문의사항</label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="answer">문의 사항에 대한 답변</label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
            />
          </div>
          <button type="submit">submit</button>
        </form>
      ) : (
        <button style={{display:"none"}} onClick={() => setShowForm(true)}>form</button> // "form" 버튼을 클릭하면 폼을 보이게 함
      )}
    </div>
  );
}

export default FormComponent;
