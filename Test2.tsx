import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

export default function Test() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  const [funds, setFunds] = useState<any[]>([
    { id: 1, name: 'ファンド１' },
    { id: 2, name: 'ファンド２' },
    { id: 3, name: 'ファンド３' },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { id: 1, message: 'メッセージ１' },
        { id: 2, message: 'メッセージ２' },
        { id: 3, message: 'メッセージ３' },
      ]);
      setIsLoading(false);
    }, 3000);
  }, []);

  const handleChange = (event: any, id: any) => {
    const value = event.target.value;
    const fixedMessages = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].id == id) {
        fixedMessages.push({ ...messages[i], message: value });
      } else {
        fixedMessages.push({ ...messages[i] });
      }
    }
    setMessages(fixedMessages);
  };

  return (
    <div id="test">
      <h2 className="title">タイトル</h2>
      {isLoading ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="fund-list">
          <h3>ファンド一覧</h3>
          {funds.map((fund) => (
            <div key={fund.id}>
              <div className="fund-name">{fund.name}</div>
              <TextField
                variant="outlined"
                name={`message${fund.id}`}
                value={messages.find((v) => v.id == fund.id).message}
                onChange={(event) => handleChange(event, fund.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
