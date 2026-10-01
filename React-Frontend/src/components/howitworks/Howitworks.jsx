import useStartAd from "../../assets/utils/useStartAd";

const Howitworks = function() {

    const { handleStart, isLoading } = useStartAd();

    return(
        <>
            {/* ============ Howitworks ============ */}
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="section-label">HOW IT WORKS</span>
                        <h2 className="section-title mt-2 mb-2">6가지 질문으로 완성돼요</h2>
                        <p className="section-desc mb-0">복잡한 광고 제작 툴 대신, 편하게 대화하듯 답하기만 하면 됩니다.</p>
                    </div>

                    <div className="row g-3">
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="step-mini">
                                <div className="step-mini-num">01</div>
                                <div className="step-mini-icon d-flex align-items-center justify-content-center">
                                    <i className="bi bi-building"></i>
                                </div>
                                <div className="step-mini-title">숙소 유형</div>
                                <div className="step-mini-desc">어떤 유형의 숙소인가요?</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="step-mini">
                                <div className="step-mini-num">02</div>
                                <div className="step-mini-icon d-flex align-items-center justify-content-center">
                                    <i className="bi bi-geo-alt"></i>
                                </div>
                                <div className="step-mini-title">숙소 정보</div>
                                <div className="step-mini-desc">이름, 위치, 주요 특징은?</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="step-mini">
                                <div className="step-mini-num">03</div>
                                <div className="step-mini-icon d-flex align-items-center justify-content-center">
                                    <i className="bi bi-award"></i>
                                </div>
                                <div className="step-mini-title">강조할 매력</div>
                                <div className="step-mini-desc">가장 자랑하고 싶은 점은?</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="step-mini">
                                <div className="step-mini-num">04</div>
                                <div className="step-mini-icon d-flex align-items-center justify-content-center">
                                    <i className="bi bi-people"></i>
                                </div>
                                <div className="step-mini-title">광고 대상</div>
                                <div className="step-mini-desc">어떤 분들에게 알리고 싶나요?</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="step-mini">
                                <div className="step-mini-num">05</div>
                                <div className="step-mini-icon d-flex align-items-center justify-content-center">
                                    <i className="bi bi-palette"></i>
                                </div>
                                <div className="step-mini-title">분위기</div>
                                <div className="step-mini-desc">어떤 분위기를 원하시나요?</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="step-mini">
                                <div className="step-mini-num">06</div>
                                <div className="step-mini-icon d-flex align-items-center justify-content-center">
                                    <i className="bi bi-chat-quote"></i>
                                </div>
                                <div className="step-mini-title">광고 문구</div>
                                <div className="step-mini-desc">어떤 메시지를 담고 싶나요?</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container pb-5">
                <div className="text-center">
                    <button
                        className="btn-cta-white d-inline-flex align-items-center gap-2"
                        onClick={handleStart}
                        disabled={isLoading}
                    >
                        {isLoading ? "준비 중..." : "광고 제작 시작하기"}
                        {!isLoading && <i className="bi bi-arrow-right"></i>}
                    </button>
                </div>
            </section>
        </>
    )
}

export default Howitworks;