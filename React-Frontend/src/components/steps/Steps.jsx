const Steps = function() {
    return(
        <>
            <section class="sf-steps" id="how">
                <div class="container">
                    <h2 class="sf-h2">이용 방법</h2>
                    <div class="row sf-steps-row">
                        <div class="col-md-4 sf-step">
                            <span class="sf-step-num">1</span>
                            <h3 class="sf-step-title">소개 글과 사진 올리기</h3>
                            <p class="sf-step-desc">숙소 이름, 유형, 특징을 적고 대표 사진을 함께 올립니다.</p>
                        </div>
                        <div class="col-md-4 sf-step">
                            <span class="sf-step-num">2</span>
                            <h3 class="sf-step-title">AI가 초안을 구성합니다</h3>
                            <p class="sf-step-desc">입력한 글과 사진을 분석해 어울리는 문구와 구도를 만듭니다.</p>
                        </div>
                        <div class="col-md-4 sf-step">
                            <span class="sf-step-num">3</span>
                            <h3 class="sf-step-title">완성된 이미지 받기</h3>
                            <p class="sf-step-desc">바로 게시할 수 있는 광고 이미지를 확인하고 내려받습니다.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Steps;