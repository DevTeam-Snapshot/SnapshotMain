import Topbar from '../components/topbar/Topbar';
import Planner from '../components/guide/Planner';
import SelectImg from '../components/selectimg/SelectImg';

import { useParams } from "react-router-dom";
import { loadPlanning } from '../assets/utils/storage';

function SelectAd() {
    const { sessionId } = useParams();
    const planning = loadPlanning(sessionId);

    return (
        <>
            <Topbar/>
            <div className="container-fluid px-4 py-4" style={{background:"linear-gradient(180deg, #fdf1ea 0%, #f7eef4 100%)"}}>
                <div className="row g-4">
                    <Planner brief={planning?.brief} completedCount={planning?.completed_fields?.length ?? 0} />
                    <SelectImg sessionId={sessionId} />
                </div>
            </div>
        </>
    );
}

export default SelectAd;