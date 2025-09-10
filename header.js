// header.js - 달래마켓 공통 헤더
(function() {
    // 헤더 스타일 생성
    function createHeaderStyles() {
        const styles = `
            /* 공통 헤더 스타일 */
            * { 
                margin: 0; 
                padding: 0; 
                box-sizing: border-box; 
            }

            /* 헤더 - 고정 */
            .top-header {
                background: white;
                border-bottom: 1px solid #e8e9eb;
                padding: 12px 0;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            /* 스크롤 시 헤더 스타일 */
            .top-header.scrolled {
                padding: 8px 0;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            }

            /* 헤더 스페이서 - 고정 헤더 공간 확보 */
            .header-spacer {
                height: 60px;
            }

            /* PC 스타일 - 1행 레이아웃 */
            @media (min-width: 769px) {
                .header-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 30px;
                    display: flex;
                    align-items: center;
                    gap: 0;
                }

                .logo-container {
                    flex-shrink: 0;
                    margin-right: 50px; /* 로고와 메뉴 사이 간격 */
                }

                .logo-img { 
                    height: 32px;  /* 1.6배 크기 */
                    object-fit: contain;
                    cursor: pointer;
                }

                .nav-menu-container {
                    flex: 1;
                    overflow: visible;
                }

                .nav-menu { 
                    display: flex; 
                    gap: 25px;
                    align-items: center;
                    padding: 0;
                }

                /* PC 텍스트 버튼 */
                .nav-btn {
                    display: inline-block;
                    padding: 5px 10px;
                    background: none;
                    border: none;
                    color: #5a5c60;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: color 0.2s;
                    white-space: nowrap;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                    position: relative;
                }

                .nav-btn:hover {
                    color: #667eea;
                }

                .nav-btn.active {
                    color: #667eea;
                }

                .nav-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80%;
                    height: 3px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 2px;
                }
            }

            /* 발주시스템 특별 애니메이션 */
            .special-btn {
                background: linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b, #eb4d4b, #6ab04c, #667eea, #ff6b6b);
                background-size: 600% 100%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: textGradient 3s ease infinite;
                font-weight: 700;
            }
            
            @keyframes textGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            .special-btn:hover {
                transform: scale(1.1);
            }

            /* 서비스&프로그램 전설 아우라 효과 */
            .legendary-btn {
                position: relative;
                font-weight: 700;
                color: #fff;
                text-shadow: 0 0 10px rgba(138, 43, 226, 0.8),
                            0 0 20px rgba(138, 43, 226, 0.6),
                            0 0 30px rgba(138, 43, 226, 0.4);
                background: linear-gradient(45deg, #8a2be2, #ff1493, #00bfff, #ffd700, #8a2be2);
                background-size: 400% 400%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: legendaryGlow 4s ease infinite, legendaryShift 8s ease infinite;
            }

            /* 전설 아우라 배경 효과 */
            .legendary-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 120%;
                height: 200%;
                background: radial-gradient(ellipse at center, 
                    rgba(138, 43, 226, 0.3) 0%,
                    rgba(255, 20, 147, 0.2) 25%,
                    rgba(0, 191, 255, 0.1) 50%,
                    transparent 70%);
                filter: blur(10px);
                animation: legendaryPulse 2s ease-in-out infinite;
                pointer-events: none;
                z-index: -1;
            }

            /* 전설 파티클 효과 */
            .legendary-btn::after {
                content: '✦';
                position: absolute;
                top: -5px;
                right: -10px;
                font-size: 10px;
                color: #ffd700;
                animation: sparkle 1.5s ease-in-out infinite;
                pointer-events: none;
            }

            @keyframes legendaryGlow {
                0%, 100% { filter: brightness(1) contrast(1); }
                50% { filter: brightness(1.2) contrast(1.1); }
            }

            @keyframes legendaryShift {
                0%, 100% { background-position: 0% 50%; }
                25% { background-position: 100% 50%; }
                50% { background-position: 100% 100%; }
                75% { background-position: 0% 100%; }
            }

            @keyframes legendaryPulse {
                0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); }
            }

            @keyframes sparkle {
                0%, 100% { opacity: 0; transform: translateY(0) rotate(0deg); }
                50% { opacity: 1; transform: translateY(-3px) rotate(180deg); }
            }

            .legendary-btn:hover {
                transform: scale(1.1);
                filter: brightness(1.3);
            }

            .legendary-btn:hover::before {
                animation-duration: 0.5s;
            }

            /* 모바일 스타일 - 2행 레이아웃 */
            @media (max-width: 768px) {
                .top-header {
                    padding: 5px 0;
                }
                
                .top-header.scrolled {
                    padding: 3px 0;
                }

                .header-spacer {
                    height: 60px;
                }

                .header-content {
                    padding: 0 15px;
                }
                
                /* 모바일 로고 영역 (1행) */
                .logo-container {
                    text-align: center;
                    padding: 2px 0;
                    margin-right: 0;
                }
                
                .logo-img {
                    height: 16px;
                }

                /* 모바일 메뉴 영역 (2행) */
                .nav-menu-container {
                    position: relative;
                    padding: 3px 0;
                    margin: 0 -15px;
                    padding-left: 15px;
                    padding-right: 15px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .nav-menu-container::-webkit-scrollbar {
                    display: none;
                }

                /* 좌우 그라데이션 효과 (스크롤 힌트) */
                .nav-menu-container::before,
                .nav-menu-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 15px;
                    z-index: 1;
                    pointer-events: none;
                }

                .nav-menu-container::before {
                    left: 0;
                    background: linear-gradient(to right, white, transparent);
                }

                .nav-menu-container::after {
                    right: 0;
                    background: linear-gradient(to left, white, transparent);
                }
                
                .nav-menu {
                    display: flex;
                    gap: 20px;
                    justify-content: flex-start;
                    padding: 0 5px;
                    min-width: fit-content;
                }
                
                .nav-btn {
                    font-size: 14px;
                    padding: 3px 8px;
                    flex-shrink: 0;
                }

                .nav-btn.active::after {
                    height: 2px;
                    bottom: -1px;
                }

                /* 모바일 전설 아우라 조정 */
                .legendary-btn {
                    text-shadow: 0 0 8px rgba(138, 43, 226, 0.8),
                                0 0 15px rgba(138, 43, 226, 0.6);
                }

                .legendary-btn::before {
                    width: 110%;
                    height: 180%;
                    filter: blur(8px);
                }

                .legendary-btn::after {
                    font-size: 8px;
                    top: -3px;
                    right: -8px;
                }
            }
        `;
        
        // style 태그 생성 및 추가
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // 헤더 HTML 생성
    function createHeader() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 모바일용 2행 레이아웃
            return `
                <!-- 헤더 스페이서 -->
                <div class="header-spacer"></div>
                
                <!-- 상단 헤더 -->
                <header class="top-header">
                    <div class="header-content">
                        <!-- 로고 영역 (1행) -->
                        <div class="logo-container">
                            <img src="https://res.cloudinary.com/dde1hpbrp/image/upload/v1753148563/05_etc/dalraemarket_papafarmers.com/DalraeMarket_loge_trans.png" 
                                 alt="달래마켓" 
                                 class="logo-img"
                                 onclick="window.location.href='index.html'">
                        </div>
                        
                        <!-- 메뉴 영역 (2행) -->
                        <div class="nav-menu-container">
                            <nav class="nav-menu" id="mainMenu">
                                <button class="nav-btn special-btn" onclick="openOrderSystem()">
                                    발주시스템
                                </button>
                                <button class="nav-btn" data-page="dashboard">
                                    대시보드
                                </button>
                                <button class="nav-btn" data-page="products">
                                    상품리스트
                                </button>
                                <button class="nav-btn" data-page="calendar">
                                    상품캘린더
                                </button>
                                <button class="nav-btn" data-page="delivery">
                                    배송캘린더
                                </button>
                                <button class="nav-btn" data-page="orders">
                                    주문관리
                                </button>
                                <button class="nav-btn legendary-btn" data-page="services">
                                    서비스&프로그램
                                </button>
                                <button class="nav-btn" data-page="notice">
                                    공지사항
                                </button>
                            </nav>
                        </div>
                    </div>
                </header>
            `;
        } else {
            // PC용 1행 레이아웃
            return `
                <!-- 헤더 스페이서 -->
                <div class="header-spacer"></div>
                
                <!-- 상단 헤더 -->
                <header class="top-header">
                    <div class="header-content">
                        <!-- 로고 영역 -->
                        <div class="logo-container">
                            <img src="https://res.cloudinary.com/dde1hpbrp/image/upload/v1753148563/05_etc/dalraemarket_papafarmers.com/DalraeMarket_loge_trans.png" 
                                 alt="달래마켓" 
                                 class="logo-img"
                                 onclick="window.location.href='index.html'">
                        </div>
                        
                        <!-- 메뉴 영역 -->
                        <div class="nav-menu-container">
                            <nav class="nav-menu" id="mainMenu">
                                <button class="nav-btn special-btn" onclick="openOrderSystem()">
                                    발주시스템
                                </button>
                                <button class="nav-btn" data-page="dashboard">
                                    대시보드
                                </button>
                                <button class="nav-btn" data-page="products">
                                    상품리스트
                                </button>
                                <button class="nav-btn" data-page="calendar">
                                    상품캘린더
                                </button>
                                <button class="nav-btn" data-page="delivery">
                                    배송캘린더
                                </button>
                                <button class="nav-btn" data-page="orders">
                                    주문관리
                                </button>
                                <button class="nav-btn legendary-btn" data-page="services">
                                    서비스&프로그램
                                </button>
                                <button class="nav-btn" data-page="notice">
                                    공지사항
                                </button>
                            </nav>
                        </div>
                    </div>
                </header>
            `;
        }
    }

    // 현재 페이지 활성화
    function setActivePage(pageName) {
        // 모든 nav-btn에서 active 클래스 제거
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 현재 페이지 버튼에 active 클래스 추가
        document.querySelectorAll(`.nav-btn[data-page="${pageName}"]`).forEach(btn => {
            btn.classList.add('active');
        });
    }

    // 발주시스템 열기
    window.openOrderSystem = function() {
        window.open('https://papafarmers.com/orders/', '_blank');
    };

    // 메뉴 클릭 처리
    function handleMenuClick(e) {
        const btn = e.currentTarget;
        const page = btn.dataset.page;
        
        if (page) {
            // 페이지 매핑 - dashboard는 index.html로
            const pageUrls = {
                'dashboard': 'index.html',
                'products': 'products.html',
                'calendar': 'calendar.html',
                'delivery': 'delivery.html',
                'orders': 'orders.html',
                'services': 'services.html',
                'notice': 'notice.html'
            };
            
            if (pageUrls[page]) {
                // 현재 페이지 확인
                const currentFile = window.location.pathname.split('/').pop() || 'index.html';
                const currentPage = currentFile.replace('.html', '');
                const currentPageName = currentPage === 'index' ? 'dashboard' : currentPage;
                
                if (currentPageName !== page) {
                    window.location.href = pageUrls[page];
                }
            }
        }
    }

    // 헤더 초기화
    function initHeader(options = {}) {
        // 스타일 먼저 추가
        createHeaderStyles();
        
        // 옵션 설정
        const { 
            containerId = 'header-container',
            activePage = null
        } = options;
        
        // 헤더 컨테이너 찾기
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`헤더 컨테이너 '${containerId}'를 찾을 수 없습니다`);
            return;
        }
        
        // 헤더 HTML 삽입
        container.innerHTML = createHeader();
        
        // 현재 페이지 활성화
        if (activePage) {
            setActivePage(activePage);
        } else {
            // URL에서 현재 페이지 추출
            const currentFile = window.location.pathname.split('/').pop() || 'index.html';
            const pageName = currentFile === 'index.html' ? 'dashboard' : currentFile.replace('.html', '');
            setActivePage(pageName);
        }
        
        // 메뉴 클릭 이벤트 설정
        document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', handleMenuClick);
        });

        // 스크롤 이벤트 - 헤더 스타일 변경
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const header = document.querySelector('.top-header');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });

        // 모바일에서 현재 활성 메뉴를 볼 수 있도록 스크롤
        if (window.innerWidth <= 768) {
            const activeBtn = document.querySelector('.nav-btn.active');
            if (activeBtn) {
                const container = document.querySelector('.nav-menu-container');
                if (container) {
                    // 활성 버튼이 중앙에 오도록 스크롤
                    setTimeout(() => {
                        const btnLeft = activeBtn.offsetLeft;
                        const btnWidth = activeBtn.offsetWidth;
                        const containerWidth = container.offsetWidth;
                        const scrollLeft = btnLeft - (containerWidth / 2) + (btnWidth / 2);
                        container.scrollLeft = scrollLeft;
                    }, 100);
                }
            }
        }

        // 화면 크기 변경 시 헤더 재생성
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const currentWidth = window.innerWidth;
                const isMobile = currentWidth <= 768;
                const headerIsMobile = document.querySelector('.logo-container').style.textAlign === 'center';
                
                // 모바일/PC 전환 시에만 재생성
                if ((isMobile && !headerIsMobile) || (!isMobile && headerIsMobile)) {
                    container.innerHTML = createHeader();
                    setActivePage(activePage || getCurrentPageName());
                    
                    // 이벤트 리스너 재설정
                    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
                        btn.addEventListener('click', handleMenuClick);
                    });
                }
            }, 250);
        });
    }

    function getCurrentPageName() {
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        return currentFile === 'index.html' ? 'dashboard' : currentFile.replace('.html', '');
    }

    // DOM이 로드되면 자동 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // 헤더 컨테이너가 있으면 자동 초기화
            if (document.getElementById('header-container')) {
                initHeader();
            }
        });
    } else {
        // 이미 DOM이 로드된 경우
        if (document.getElementById('header-container')) {
            initHeader();
        }
    }

    // 전역으로 내보내기
    window.DalraeHeader = {
        init: initHeader,
        setActivePage: setActivePage
    };
})();
