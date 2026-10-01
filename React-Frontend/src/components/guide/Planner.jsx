import { useState } from 'react';
import { STEPS, getStepAnswerText } from '../../assets/utils/planningSteps';

// 이 글자 수를 넘는 답변만 접기/펼치기 버튼을 보여줌
const CLAMP_THRESHOLD = 40;

const Planner = function({ brief }) {
    const completedCount = STEPS.filter((_, i) => getStepAnswerText(i, brief)).length;

    // ✅ 추가: 펼쳐진 항목 번호 목록
    const [expanded, setExpanded] = useState(new Set());

    const toggle = (num) => {
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(num) ? next.delete(num) : next.add(num);
            return next;
        });
    };

    return (
        <>
            <div className="col-lg-3">
                <div className="side-panel h-100 d-flex flex-column p-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="side-title text-nowrap">완성된 광고 기획서</span>
                        <span className="side-count text-nowrap">{completedCount} / {STEPS.length}</span>
                    </div>
                    <p className="side-desc mb-3">멋진 광고가 될 수 있도록<br/>아래 내용으로 기획을 완료했어요!</p>

                    <div className="flex-grow-1">
                        {STEPS.map((step, i) => {
                            const text = getStepAnswerText(i, brief) || '—';
                            const isLong = text.length > CLAMP_THRESHOLD;
                            const isOpen = expanded.has(step.num);

                            return (
                                <div className="qa-item" key={step.num}>
                                    <div className="qa-num mb-1">
                                        {step.num} <span className="qa-label ms-1">{step.title}</span>
                                    </div>
                                    <div className={`qa-answer-marker ${isLong && !isOpen ? 'is-clamped' : ''}`}>
                                        {text}
                                    </div>
                                    {isLong && (
                                        <button
                                            type="button"
                                            className="qa-more"
                                            onClick={() => toggle(step.num)}
                                            aria-expanded={isOpen}
                                        >
                                            {isOpen ? '접기' : '더보기'}
                                            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} ms-1`}></i>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Planner;
