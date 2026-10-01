import useStartAd from "../../assets/utils/useStartAd";
import exampleImg from "../../assets/examples/example.png"; // ✅ 추가

const Hero = function(){
    const { handleStart, isLoading } = useStartAd();

    return(
        <>
            {/* ============ HERO ============ */}
            <section className="hero">
                <div className="container" style={{background:"linear-gradient(135deg, #fef6f0 0%, #f9ede3 50%, #fbeae0 100%)"}}>
                    <div className="row align-items-center g-5">

                        {/* 좌측: 헤드라인 */}
                        <div className="col-lg-6">
                            <span className="hero-eyebrow">
                                <i className="bi bi-stars"></i> AI와 대화 한 번으로 완성
                            </span>
                            <h1 className="hero-title">우리 숙소만의 이야기를,<br/>
                                <span className="gradient-text">멋진 광고</span>로 만들어보세요
                            </h1>
                            <p className="hero-desc">
                            숙소 이름과 사진 몇 장이면 충분해요. Snapshot의 AI 광고 플래너가
                            질문 몇 가지로 당신의 숙소를 가장 매력적으로 보여줄 광고를 함께 완성합니다.
                            </p>
                            <div className="hero-cta-row d-flex flex-wrap gap-2">
                                <button
                                    className="btn-hero-primary d-flex align-items-center gap-2"
                                    onClick={handleStart}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "준비 중..." : "지금 광고 만들어보기"}
                                    {!isLoading && <i className="bi bi-arrow-right"></i>}
                                </button>
                            </div>
                            <p className="hero-meta">
                            <i className="bi bi-check-circle text-success"></i> 신용카드 없이 무료로 시작 ·
                            평균 <strong>5분</strong>이면 초안 완성
                            </p>
                        </div>

                        {/* 우측: 비주얼 */}
                        <div className="col-lg-6">
                            <div className="hero-visual">
                                <div className="hero-visual-bg"></div>

                                <div className="hero-photo-card">
                                    <img src={exampleImg} alt="숙소 광고 예시"/>
                                    <div className="hero-photo-caption">
                                        <span className="hero-photo-tag">B안 · 감성 중심</span>
                                        <div className="hero-photo-title">도심 위, 둘만의 특별한 하루</div>
                                        <div className="hero-photo-sub">서울호텔 · 서울 중구</div>
                                    </div>
                                </div>

                                <div className="mini-card mini-card-1">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-robot" style={{color:"#fe4a03"}}></i> 남산뷰 객실 · 루프탑
                                    </div>
                                    <small>강조하고 싶은 매력으로 등록됨</small>
                                </div>

                                <div className="mini-card mini-card-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-check2-circle" style={{color:"#8204f8"}}></i> 6 / 6 완료
                                    </div>
                                    <small>광고 초안 3종 생성 완료</small>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero;