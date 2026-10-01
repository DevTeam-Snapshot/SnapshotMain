// planningSteps.js

export const STEPS = [
    { num: '01', icon: 'bi-building',    title: '숙소 유형', desc: '어떤 유형의 숙박 시설인가요?' },
    { num: '02', icon: 'bi-geo-alt',     title: '숙소 정보', desc: '숙박 시설의 이름과 위치는?' },
    { num: '03', icon: 'bi-award',       title: '숙소 특징', desc: '가장 자랑하고 싶은 점은?' },
    { num: '04', icon: 'bi-people',      title: '광고 대상', desc: '어떤 분들에게 알리고 싶나요?' },
    { num: '05', icon: 'bi-palette',     title: '분위기',   desc: '어떤 분위기를 원하시나요?' },
    { num: '06', icon: 'bi-chat-quote',  title: '광고 문구', desc: '어떤 메시지를 담고 싶나요?' },
];

const FIELD_TO_STEP_INDEX = {
    lodging_type: 0,
    lodging_type_detail: 0,
    lodging_information: 1,
    lodging_name: 1,          // ✅ 추가
    location: 1,              // ✅ 추가
    selling_points: 2,
    lodging_service: 2,       // ✅ 추가: 서비스도 '강조할 매력' 카드로
    original_image: 2,        // ✅ 추가: 사진은 매력 다음에 요청되므로
    target_audience: 3,
    mood: 4,
    color_preference: 4,
    ad_copy: 5,
};

// completed_fields는 더 이상 인덱스 계산에 쓰지 않음.
// 서버가 알려주는 current_step이 유일한 신뢰의 원천.
export function computeActiveStepIndex(currentStep, isComplete = false) {
    if (isComplete) return STEPS.length; // 전부 완료 → 마지막 카드까지 채움

    const idx = FIELD_TO_STEP_INDEX[currentStep];
    return idx ?? 0; // 매핑 안 되는 값(예: original_image)이 오면 일단 0번으로 폴백
}

const LODGING_TYPE_LABELS = {
    hotel: '호텔',
    motel: '모텔',
    resort: '리조트',
    pension: '펜션',
};

export function getStepAnswerText(stepIndex, brief) {
    if (!brief) return '';

    switch (stepIndex) {
        case 0: // 숙소 유형 — lodging_type(코드→한글) 우선, 없으면 lodging_type_detail(원문 그대로)
            if (brief.lodging_type) {
                return LODGING_TYPE_LABELS[brief.lodging_type] ?? brief.lodging_type;
            }
            return brief.lodging_type_detail ?? '';
        case 1:
            return [brief.lodging_name, brief.location].filter(Boolean).join(' · ');
        case 2:
            return [...(brief.selling_points ?? []), ...(brief.lodging_service ?? [])].join(' · ');
        case 3:
            return brief.target_audience ?? '';
        case 4:
            return [brief.mood, brief.color_preference].filter(Boolean).join(' · ');
        case 5:
            return brief.ad_copy ?? '';
        default:
            return '';
    }
}