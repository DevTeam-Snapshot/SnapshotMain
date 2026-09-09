import { useState } from 'react';
import { askQuestion } from './api';

export default function App() {
  const [input, setInput] = useState('');
  const [index, setIndex] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      setResult(await askQuestion(input.trim(), index));
    } catch (requestError) {
      setResult(null);
      setError(requestError.message || 'Backend에 연결할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app">
      <h1>로컬 AI 연동 테스트</h1>
      <form onSubmit={submitMessage}>
        <label htmlFor="question-input">질문</label>
        <input id="question-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="안녕" minLength={1} maxLength={1000} required />
        <label htmlFor="index-input">DB index</label>
        <input id="index-input" type="number" min="1" value={index} onChange={(event) => setIndex(Number(event.target.value))} required />
        <button type="submit" disabled={isLoading}>{isLoading ? '응답 대기 중...' : '질문하기'}</button>
      </form>
      {error && <p className="message">{error}</p>}
      {result && <section className="result"><p><strong>Index:</strong> {result.index}</p><p><strong>DB text:</strong> {result.db_text}</p><p><strong>Model answer:</strong> {result.model_answer}</p></section>}
    </main>
  );
}
