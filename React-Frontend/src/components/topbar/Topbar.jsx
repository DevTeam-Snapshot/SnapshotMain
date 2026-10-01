const Topbar = function() {

    return (
    <>
        {/* Topbar */}
        <nav className="topbar py-3 px-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
                <span className="brand">Snapshot</span>
                <span className="brand-sub d-none d-sm-inline">숙소의 매력을 광고로</span>
            </div>
        </nav>
        
        {/* Topbar another version
        <nav class="topbar py-3 px-4 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <span class="brand">Snapshot</span>
                <span class="brand-sub">숙소의 매력을 광고로</span>
            </div>
            <div class="d-flex align-items-center gap-3">
                <button class="btn btn-sm btn-light border rounded-pill px-3 d-flex align-items-center gap-1">
                <i class="bi bi-clipboard-check"></i>
                <span style="font-size:.85rem;">내 작업</span>
                </button>
                <div class="avatar-chip d-flex align-items-center justify-content-center">K</div>
            </div>
        </nav> */}

    </>
    )
}

export default Topbar;