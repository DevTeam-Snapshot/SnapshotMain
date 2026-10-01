import Topbar from '../components/topbar/Topbar';
import Guide from '../components/guide/Guide';
import Chat from '../components/chat/Chat';

import { useParams } from "react-router-dom";
import { usePlanningProgress } from '../assets/utils/usePlanningProgress';
import { computeActiveStepIndex } from '../assets/utils/planningSteps';

function MakingAds() {
  const { sessionId } = useParams(); // ✅ URL 파라미터에서 실제 세션 ID 추출

  const { planning } = usePlanningProgress(sessionId);

  const activeStepIndex = computeActiveStepIndex(
    planning?.current_step,
    planning?.is_complete ?? false
  );

  return (
    <>
      <Topbar />
      <div
        className="container-fluid px-4 py-4"
        style={{ maxWidth: "1280px", margin: "0 auto", background: "linear-gradient(180deg, #fdf1ea 0%, #f7eef4 100%)" }}
      >
        <Guide activeStepIndex={activeStepIndex} />
        <Chat sessionId={sessionId} activeStepIndex={activeStepIndex} />
      </div>
    </>
  );
}

export default MakingAds;