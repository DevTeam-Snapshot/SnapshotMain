// assets/utils/usePlanningProgress.js
import { useState, useEffect } from "react";
import { loadPlanning, PLANNING_EVENT } from "./storage"; // 같은 폴더면 상대경로 ./storage

export function usePlanningProgress(sessionId) {
  const [planning, setPlanning] = useState(() => loadPlanning(sessionId));

  useEffect(() => {
    const handler = (e) => {
      if (e.detail.sessionId === sessionId) setPlanning(e.detail.data);
    };
    window.addEventListener(PLANNING_EVENT, handler);
    return () => window.removeEventListener(PLANNING_EVENT, handler);
  }, [sessionId]);

  return { planning };
}