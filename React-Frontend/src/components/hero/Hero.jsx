const Hero = function(){
    return(
        <>
            <section class="sf-hero" id="top">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <h1 class="sf-h1">숙소 사진 한 장,<br />광고 이미지 한 장</h1>
                            <p class="sf-lead">
                                가지고 계신 사진과 숙소 소개 글만 올려주시면, 예약을 부르는 광고 이미지로 바꿔드립니다.
                                디자인을 몰라도, 사진을 다시 찍지 않아도 괜찮습니다.
                            </p>
                            <a href="#submit" class="sf-btn sf-btn-primary">지금 만들어보기</a>
                        </div>

                        <div class="col-lg-6">
                            <div class="sf-hero-visual">
                                <div class="sf-photo-card sf-photo-raw">
                                    <div class="sf-photo-fill sf-fill-1"></div>
                                    <span class="sf-photo-tag">올린 사진</span>
                                </div>
                                <div class="sf-photo-card sf-photo-result">
                                    <div class="sf-photo-fill sf-fill-2"></div>
                                    <div class="sf-result-copy">
                                        <p class="sf-result-headline">가을이 머무는 창가,<br />숲속펜션</p>
                                        <span class="sf-result-cta">지금 예약하기</span>
                                    </div>
                                    <span class="sf-photo-tag sf-photo-tag-dark">완성된 광고</span>
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