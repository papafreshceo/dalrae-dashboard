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
                padding: 8px 0;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            /* 스크롤 시 헤더 스타일 */
            .top-header.scrolled {
                padding: 5px 0;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            }

            /* 헤더 스페이서 - 고정 헤더 공간 확보 */
            .header-spacer {
                height: 70px; /* 헤더 높이만큼 공간 확보 */
            }

            .header-content {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 30px;
            }

            /* 로고 영역 */
            .logo-container {
                text-align: center;
                padding: 3px 0;
            }

            .logo-img { 
                height: 20px;  /* 50% 크기로 축소 */
                object-fit: contain;
                cursor: pointer;
            }

            /* 메뉴 컨테이너 */
            .nav-menu-container {
                overflow-x: auto;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                -ms-overflow-style: none;
                padding: 5px 0;
            }

            .nav-menu-container::-webkit-scrollbar {
                display: none;
            }

            .nav-menu { 
                display: flex; 
                gap: 25px;
                justify-content: center;
                min-width: fit-content;
                padding: 0;
            }

            /* PC 스타일 - 심플한 텍스트 버튼 */
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

            /* 모바일 스타일 */
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
                
                .logo-img {
                    height: 16px;  /* 모바일에서도 작게 */
                }
                
                .header-content {
                    padding: 0 15px;
                }

                .logo-container {
                    padding: 2px 0;
                }

                .nav-menu-container {
                    position: relative;
                    padding: 3px 0;
                    margin: 0 -15px;
                    padding-left: 15px;
                    padding-right: 15px;
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
                    gap: 20px;
                    justify-content: flex-start;
                    padding: 0 5px;
                }
                
                .nav-btn {
                    font-size: 14px;
                    padding: 3px 8px;
                }

                .nav-btn.active::after {
                    height: 2px;
                    bottom: -1px;
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
        const headerHTML = `
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
                            <button class="nav-btn" data-page="services">
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
        
        return headerHTML;
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
