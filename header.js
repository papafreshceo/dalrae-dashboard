function loadHeader() {
    const headerHTML = `
    <header class="top-header">
        <div class="header-content">
            <img src="https://res.cloudinary.com/dde1hpbrp/image/upload/v1753148563/05_etc/dalraemarket_papafarmers.com/DalraeMarket_loge_trans.png" 
                 alt="달래마켓" 
                 class="logo-img">
            <nav class="nav-menu" id="mainMenu">
                <button class="nav-btn" data-page="index" onclick="location.href='index.html'">
                    <span>📊</span>
                    <span>대시보드</span>
                </button>
                <button class="nav-btn" data-page="products" onclick="location.href='products.html'">
                    <span>📦</span>
                    <span>상품리스트</span>
                </button>
                <button class="nav-btn" data-page="calendar">
                    <span>📅</span>
                    <span>상품캘린더</span>
                </button>
                <button class="nav-btn" data-page="orders">
                    <span>📋</span>
                    <span>주문관리</span>
                </button>
                <button class="nav-btn" data-page="services">
                    <span>🎯</span>
                    <span>서비스&프로그램</span>
                </button>
                <button class="nav-btn" data-page="notice">
                    <span>📢</span>
                    <span>공지사항</span>
                </button>
            </nav>
        </div>
    </header>`;
    
    document.getElementById('header-container').innerHTML = headerHTML;
    
    // 현재 페이지 활성화
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentFile.replace('.html', '');
    const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', loadHeader);