import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useStartAd() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const res = await fetch("/api/planning-sessions", { method: "POST" });
            if (!res.ok) throw new Error(`세션 생성 실패 (${res.status})`);

            const session = await res.json();
            navigate(`/makingads/${session.id}`, {
                state: { fromButton: true, session },
            });
        } catch (err) {
            console.error(err);
            alert("광고 기획을 시작하지 못했어요. 잠시 후 다시 시도해주세요.");
            setIsLoading(false);
        }
    };

    return { handleStart, isLoading };
}