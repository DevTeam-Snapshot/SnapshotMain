const Header = function() {

    return (
    <>
        <header class="sf-header">
            <nav class="navbar navbar-expand-lg container sf-nav">
                <a class="navbar-brand sf-brand" href="#top">
                    Snapshot!
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#sfNav" aria-controls="sfNav" aria-expanded="false" aria-label="메뉴 열기">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="sfNav">
                    <ul class="navbar-nav sf-nav-links align-items-lg-center">
                        <li class="nav-item"><a class="nav-link" href="#how">이용 방법</a></li>
                        <li class="nav-item"><a class="nav-link" href="#submit">신청하기</a></li>
                        <li class="nav-item"><a class="nav-link" href="#examples">완성 예시</a></li>
                        <li class="nav-item">
                            <a class="sf-btn sf-btn-primary sf-btn-sm" href="#submit">만들어보기</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>

    </>
    )
}

export default Header;