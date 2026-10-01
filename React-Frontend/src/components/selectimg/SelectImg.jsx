import { generateDrafts, regenerateDrafts, downloadDraft } from "../../assets/utils/imageApi";
import { useState, useEffect, useRef, useCallback } from "react";

import Modal from "./Modal";
const DIRECTION_LABELS = {
    room: "공간 중심",
    emotion: "감성 중심",
    benefit: "혜택 중심",
};

const DIRECTION_CAPTIONS = {
    room: "객실과 전망을 선명하게",
    emotion: "머무는 순간의 감성을 강조",
    benefit: "서비스와 혜택을 한눈에",
};

// ✅ 추가: 로딩 화면을 최초 생성/재생성에서 같이 쓰도록 분리
function LoadingView({ title }) {
    return (
        <div className="col-lg-9 select-col">
            <div className="side-panel p-4">
                <div className="loading-state" role="status" aria-live="polite">
                    <svg className="win-ring" viewBox="0 0 48 48" aria-hidden="true">
                        <defs>
                            <linearGradient id="winRingGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ff8a5c" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                        <circle className="win-ring__arc" cx="24" cy="24" r="20" pathLength="100" />
                    </svg>
                    <p className="loading-title">{title}</p>
                    <p className="loading-sub">
                        세 가지 초안을 준비하는 중이에요.<br />
                        조금만 기다려 주세요. 최대 5분 소요됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}

const SelectImg = function({ sessionId }) {
    const [drafts, setDrafts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    // ✅ 추가: 재생성 관련 상태
    const [regenerationUsed, setRegenerationUsed] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [regenError, setRegenError] = useState(null);

    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const [previewId, setPreviewId] = useState(null);
    const closePreview = useCallback(() => setPreviewId(null), []);


    const hasRequestedRef = useRef(false);

    useEffect(() => {
        if (!sessionId || hasRequestedRef.current) return;
        hasRequestedRef.current = true;

        async function run() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await generateDrafts(sessionId);
                setDrafts(data.drafts ?? []);
                // ✅ 추가: 새로고침 후에도 이미 사용했는지 서버 값으로 복원
                setRegenerationUsed(Boolean(data.regeneration_used));
                const alreadySelected = data.drafts?.find(d => d.is_selected);
                if (alreadySelected) setSelectedId(alreadySelected.id);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        run();
    }, [sessionId]);

    // ✅ 추가: 다시 생성 버튼 핸들러
    async function handleRegenerate() {
        if (regenerationUsed || isRegenerating) return;

        const ok = window.confirm(
            "다시 생성은 1회만 할 수 있어요.\n지금 보이는 세 초안은 새 초안으로 바뀌어요. 다시 생성할까요?"
        );
        if (!ok) return;

        setIsRegenerating(true);
        setRegenError(null);
        setPreviewId(null);

        try {
            const data = await regenerateDrafts(sessionId);
            setDrafts(data.drafts ?? []);
            setRegenerationUsed(Boolean(data.regeneration_used ?? true));
            setSelectedId(null); // 새 초안은 id가 바뀌므로 선택 초기화
            setDownloadError(null);
        } catch (err) {
            // 이미 사용한 경우(서버가 409 등으로 거절) 버튼도 잠금
            if (err.status === 409) setRegenerationUsed(true);
            setRegenError(err.message);
            // 실패 시 기존 초안은 그대로 유지
        } finally {
            setIsRegenerating(false);
        }
    }

    async function handleDownload() {
        if (!selectedId || isDownloading) return;

        const selected = drafts.find(d => d.id === selectedId);
        if (!selected || selected.status !== 'completed') {
            setDownloadError('생성이 완료된 초안만 다운로드할 수 있어요.');
            return;
        }

        setIsDownloading(true);
        setDownloadError(null);
        try {
            await downloadDraft(selectedId);
        } catch (err) {
            setDownloadError(err.message);
        } finally {
            setIsDownloading(false);
        }
    }

    if (isLoading) return <LoadingView title="광고 이미지를 만들고 있어요" />;
    if (isRegenerating) return <LoadingView title="새로운 초안을 다시 만들고 있어요" />;

    if (error) {
        return (
            <div className="col-lg-9 select-col">
                <div className="side-panel p-4">
                    <div className="d-flex align-items-center justify-content-center py-5 text-danger">
                        이미지를 불러오지 못했어요. ({error})
                    </div>
                </div>
            </div>
        );
    }

    const selectedIndex = drafts.findIndex(d => d.id === selectedId);
    const selectedLetter = selectedIndex >= 0 ? String.fromCharCode(65 + selectedIndex) : null;

    // ✅ 추가: 미리보기 대상 계산
    const previewIndex = drafts.findIndex(d => d.id === previewId);
    const previewDraft = previewIndex >= 0 ? drafts[previewIndex] : null;
    const previewLabel = previewDraft
        ? (DIRECTION_LABELS[previewDraft.direction] ?? previewDraft.direction)
        : "";


    return (
        <div className="col-lg-9 select-col">
            <div className="side-panel d-flex flex-column p-4">

                <div className="mb-3">
                    <h2 className="main-title mb-1">마음에 드는 초안을 골라주세요</h2>
                    <p className="main-sub mb-0">같은 이야기, 서로 다른 세 가지 광고 방향을 준비했어요.</p>
                </div>

                <div className="row g-3 align-items-start">
                    {drafts.map((draft, i) => {
                        const isSelected = selectedId === draft.id;
                        const letter = String.fromCharCode(65 + i);
                        const label = DIRECTION_LABELS[draft.direction] ?? draft.direction;

                        return (
                            <div className="col-md-4" key={draft.id}>
                                <label     className={`draft-card d-block ${isSelected ? 'draft-card--selected' : ''}`}
                                    onContextMenu={e => e.preventDefault()}>
                                    <div className="draft-card-head d-flex align-items-center gap-2">
                                        <input
                                            type="radio"
                                            name="draft"
                                            className="form-check-input m-0"
                                            checked={isSelected}
                                            onChange={() => setSelectedId(draft.id)}
                                            disabled={draft.status !== 'completed'}
                                        />
                                        <span className="draft-option-label">{letter}안 · {label}</span>
                                        {isSelected && (
                                            <span className="selected-badge ms-auto">
                                                <i className="bi bi-check-lg"></i> 선택됨
                                            </span>
                                        )}
                                    </div>

                                    {draft.status === 'completed' ? (
                                        <img
                                            src={draft.image_url}
                                            alt={label}
                                            className="draft-image protected-img"
                                            draggable={false}
                                            onClick={() => {
                                                setSelectedId(draft.id);
                                                setPreviewId(draft.id);
                                            }}
                                            onContextMenu={e => e.preventDefault()}
                                        />
                                    ) : (
                                        <div className="draft-error">
                                            {draft.error_message ?? '생성에 실패했어요.'}
                                        </div>
                                    )}

                                    <div className="draft-caption">{DIRECTION_CAPTIONS[draft.direction]}</div>
                                </label>
                            </div>
                        );
                    })}
                </div>

                {/* ✅ 추가: 재생성 실패 메시지 (기존 초안은 유지) */}
                {regenError && (
                    <div className="regen-error mt-3" role="alert">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        다시 생성하지 못했어요. 기존 초안을 그대로 보여드릴게요. ({regenError})
                    </div>
                )}

                {downloadError && (
                    <div className="regen-error mt-3" role="alert">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        다운로드하지 못했어요. ({downloadError})
                    </div>
                )}

                <div className="d-flex align-items-center gap-2 mt-3">
                    <span className="footer-note me-auto">
                        <i className="bi bi-info-circle me-1"></i>
                        {regenerationUsed
                            ? '다시 생성을 사용했어요. 이 중에서 골라 다운로드해 주세요.'
                            : '마음에 드는 초안이 없다면 1회 다시 생성할 수 있어요.'}
                    </span>
                    <button
                        type="button"
                        className="btn-regenerate d-flex align-items-center gap-2"
                        onClick={handleRegenerate}
                        disabled={regenerationUsed || isRegenerating}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                        {regenerationUsed ? '다시 생성 완료' : '다시 생성 (1회)'}
                    </button>
                    <button
                        type="button"
                        className="btn-proceed d-flex align-items-center gap-2"
                        onClick={handleDownload}
                        disabled={!selectedId || isDownloading}
                    >
                        <i className={`bi ${isDownloading ? 'bi-hourglass-split' : 'bi-download'}`}></i>
                        {isDownloading
                            ? '다운로드 중...'
                            : selectedLetter ? `${selectedLetter}안으로 다운로드` : '선택한 초안 다운로드'}
                    </button>
                </div>

                <Modal
                    overlay
                    isOpen={Boolean(previewDraft)}
                    onClose={closePreview}
                    title={previewDraft ? `${String.fromCharCode(65 + previewIndex)}안 · ${previewLabel}` : ""}
                    headerExtra={previewDraft && selectedId === previewDraft.id && (
                        <span className="selected-badge">
                            <i className="bi bi-check-lg"></i> 선택됨
                        </span>
                    )}
                >
                    {previewDraft && (
                        <img
                            src={previewDraft.image_url}
                            alt={previewLabel}
                            className="preview-image protected-img"
                            draggable={false}
                            onContextMenu={e => e.preventDefault()}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default SelectImg;
