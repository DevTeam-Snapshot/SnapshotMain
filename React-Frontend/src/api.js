const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000';

export async function askQuestion(question, index) {
  const response = await fetch('/api/integration-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, index }),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const detail = typeof errorBody?.detail === 'string'
      ? errorBody.detail
      : `Backend request failed: ${response.status}`;
    throw new Error(detail);
  }
  return response.json();
}
