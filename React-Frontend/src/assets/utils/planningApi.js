export async function uploadOriginalImage(sessionId, file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`/api/planning-sessions/${sessionId}/original-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`이미지 업로드 실패 (${res.status}) ${detail}`);
  }
  return res.json();
}

export async function confirmPlanning(sessionId, brief) {
  const res = await fetch(`/api/planning-sessions/${sessionId}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brief),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`확정 요청 실패 (${res.status}) ${detail}`);
  }
  return res.json();
}