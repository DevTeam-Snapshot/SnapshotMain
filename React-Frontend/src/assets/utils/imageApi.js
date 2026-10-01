export async function generateDrafts(sessionId) {
  const res = await fetch(`/api/planning-sessions/${sessionId}/draft-generations`, {
    method: "POST",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`초안 생성 실패 (${res.status}) ${detail}`);
  }
  return res.json();
}

export async function regenerateDrafts(sessionId) {
    const res = await fetch(`/api/planning-sessions/${sessionId}/draft-generations/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        let detail = `요청 실패 (${res.status})`;
        try {
            const body = await res.json();
            if (body?.detail) detail = typeof body.detail === "string" ? body.detail : detail;
        } catch { /* JSON이 아닌 응답은 무시 */ }

        const err = new Error(detail);
        err.status = res.status; // SelectImg에서 409(이미 사용함) 판별용
        throw err;
    }

    return res.json(); // { session_id, regeneration_used, drafts: [...] }
}


function parseFilename(disposition, fallback) {
    if (!disposition) return fallback;
    // filename*=UTF-8''... 형식 우선, 없으면 filename="..."
    const utf8 = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8) return decodeURIComponent(utf8[1]);
    const plain = disposition.match(/filename="?([^";]+)"?/i);
    return plain ? plain[1] : fallback;
}

export async function downloadDraft(draftId) {
    const res = await fetch(`/api/drafts/${draftId}/download`, {  // ✅ 상대 경로
        method: "GET",
    });

    if (!res.ok) {
        const messages = {
            404: "이미지 파일을 찾을 수 없어요.",
            409: "아직 생성이 완료되지 않았거나 생성에 실패한 초안이에요.",
        };
        const err = new Error(messages[res.status] ?? `다운로드에 실패했어요. (HTTP ${res.status})`);
        err.status = res.status;
        throw err;
    }

    const blob = await res.blob();
    const filename = parseFilename(
        res.headers.get("Content-Disposition"),
        `Snapshot.png`
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // 클릭 직후 바로 해제하면 일부 브라우저에서 다운로드가 끊길 수 있어 약간 지연
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}