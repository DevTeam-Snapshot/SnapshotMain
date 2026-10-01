export async function sendTurn(sessionId, payload) {
  const res = await fetch(`/api/planning-sessions/${sessionId}/turns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`대화 요청 실패 (${res.status}) ${detail}`);
  }
  return res.json();
}