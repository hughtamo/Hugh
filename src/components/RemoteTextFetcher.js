import React, { useState, useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';

function RemoteTextFetcher() {
  const [remoteText, setRemoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 원격 URL 설정
    const serviceKey= process.env.REACT_APP_MINWON_API_KEY;
    const decodedKey = decodeURI(serviceKey);
            
    let KEY = decodedKey.split('"');
    KEY = KEY[0];
            
    const remoteUrl = `http://apis.data.go.kr/1140100/minAnalsInfoView5/minWdcloudInfo5?serviceKey=${KEY}&target=pttn,dfpt,saeol&searchword=교권침해&dateFrom=20230801&dateTo=20230922&resultCount=100&dataType=json`;
    //const remoteUrl = 'https://example.com/remote-text';

    // fetch를 사용하여 원격 URL에서 텍스트 가져오기
    fetch(remoteUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('네트워크 오류');
        }
        return response.text();
      })
      .then((data) => {
        setRemoteText(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  var result = remoteText.replace(/label/gi,'text');
  var arr = JSON.parse(result);
  //console.log(arr);
  
  return (
    <div>
        <h2>"교권침해" 연관어 분석 정보</h2>
        <h3>출처 - 국민권익위원회 민원빅데이터 분석정보</h3>
        <ReactWordcloud options={{
                fontFamily: 'Noto Sans KR',
                fontSizes: [20,40],
                rotationAngles: [-90,0],
                fontWeight: 1000,
            }}
            size={[1000,800]} words={arr} />
    </div>
  );
}

export default RemoteTextFetcher;