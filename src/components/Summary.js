import React, { useState } from "react";
//import { useMutation } from "react-apollo-hooks";
//import { InputAdornment, TextField, Icon } from "@material-ui/core";
//import styles from "./Form.module.scss";
//import gql from "graphql-tag";

function Summarize(messageinput) {
    const [loading, setLoading] = useState(false);
    const [responseText, setResponseText] = useState('');
    const [setKeywords] = useState('');
    const api_key = "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";  // <- API KEY 입력
    
    const keywords = messageinput.data;

    console.log(keywords);
    
    const handleSummarize = async () => {
      setLoading(true);
  
      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: keywords + '을 요약해줘.' },
      ];
  
      const data = {
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        n: 1,
        messages: messages,
      };
  
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: 'POST',
          headers: {
            Authorization: "Bearer " + api_key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const responseData = await response.json();
        setResponseText(responseData.choices[0].message.content);
        setKeywords('');
      } catch (error) {
        console.error(error);
      }
  
      setLoading(false);
    };
  
    return (
      <div>
        <button onClick={handleSummarize}>Summarize</button>
  
        {loading && <div id="loading">Loading...</div>}
  
        <div id="result">
          {responseText && <pre>{responseText}</pre>}
        </div>
      </div>
    );
  }
  
  export default Summarize;