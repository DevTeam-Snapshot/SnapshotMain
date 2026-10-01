// assets/utils/storage.js

const key = (sessionId) => `planning:${sessionId}`;
export const PLANNING_EVENT = "planning-updated";

export function loadPlanning(sessionId) {
  try {
    const raw = sessionStorage.getItem(key(sessionId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePlanning(sessionId, data) {
  try {
    sessionStorage.setItem(key(sessionId), JSON.stringify(data));
    // sessionStorage.setItem 자체는 같은 탭 안에서 storage 이벤트를 쏘지 않으므로,
    // 같은 탭의 다른 컴포넌트(Guide.jsx 등)에게 직접 알려줘야 함
    window.dispatchEvent(
      new CustomEvent(PLANNING_EVENT, { detail: { sessionId, data } })
    );
  } catch {
    // 저장 실패해도 대화는 계속 진행 (메모리 값 사용)
  }
}

export function clearPlanning(sessionId) {
  try {
    sessionStorage.removeItem(key(sessionId));
    window.dispatchEvent(
      new CustomEvent(PLANNING_EVENT, { detail: { sessionId, data: null } })
    );
  } catch {}
}

export const createInitialBrief = () => ({
  lodging_type: null,
  lodging_type_detail: null,
  lodging_name: null,
  location: null,
  selling_points: [],
  lodging_service: [],      // ✅ 추가
  mood: null,
  color_preference: null,
  target_audience: null,
  ad_copy: null,
  //inputimgmessage : null
});

// 저장된 값이 있으면 그대로 반환하고, 없을 때만 초기값을 만들어 저장
export function initPlanning(sessionId, defaultStep = null) {
  const existing = loadPlanning(sessionId);
  if (existing?.brief) {
    return { ...existing, brief: { ...createInitialBrief(), ...existing.brief } };  // ✅ 변경
  }

  const initial = {
    brief: createInitialBrief(),
    current_step: defaultStep,
    completed_fields: [],
    missing_fields: [],
    is_complete: false,
  };
  savePlanning(sessionId, initial);
  return initial;
}

export function applyTurnResponse(sessionId, planning, data) {
  const updated = {
    ...planning,
    brief: { ...planning.brief, ...(data.brief_updates ?? {}) },
    current_step: data.next_step ?? planning.current_step,
    completed_fields: data.completed_fields ?? planning.completed_fields,
    missing_fields: data.missing_fields ?? planning.missing_fields,
    is_complete: data.is_complete ?? false,
    answer_status: data.answer_status,
  };
  savePlanning(sessionId, updated);
  return updated;
}