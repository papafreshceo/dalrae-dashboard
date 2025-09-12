// header.js - 달래마켓 공통 헤더 (모바일 3행 버전)
(function() {
    // 페이지 전환 전 상태 저장
    function saveHeaderState() {
        const activePage = document.querySelector('.nav-btn.active')?.dataset.page || 'index';
        localStorage.setItem('dalrae_active_page', activePage);
    }

    // 헤더 스타일 생성
    function createHeaderStyles() {
        const styles = `
            /* 페이지 전환 부드럽게 */
            body {
                opacity: 0;
                animation: fadeIn 0.3s ease-out forwards;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }

            /* 공통 헤더 스타일 */
            * { 
                margin: 0; 
                padding: 0; 
                box-sizing: border-box; 
            }

            /* 헤더 - 고정 */
            .top-header {
                background: var(--bg-primary, #ffffff);
                border-bottom: 1px solid var(--border-default, #dee2e6);
                padding: var(--space-lg, 16px) 0;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: var(--z-sticky, 30);
            }

            /* 헤더 스페이서 - 고정 헤더 공간 확보 */
            .header-spacer {
                height: 70px;
            }

            /* PC 스타일 - 1행 레이아웃 */
            @media (min-width: 769px) {
                .header-content {
                    max-width: var(--container-max, 1400px);
                    margin: 0 auto;
                    padding: 0 30px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .logo-container {
                    flex-shrink: 0;
                    margin-right: 30px;
                }

                .logo-img { 
                    height: 32px;
                    object-fit: contain;
                    cursor: pointer;
                }

                .nav-menu-container {
                    flex: 1;
                    overflow: visible;
                    display: flex;
                    justify-content: center;
                }

                .nav-menu { 
                    display: flex; 
                    gap: var(--space-lg, 16px);
                    align-items: center;
                    padding: 0;
                    flex-wrap: nowrap;
                }

                /* PC 텍스트 버튼 */
                .nav-btn {
                    display: inline-block;
                    padding: 8px 12px;
                    background: none;
                    border: none;
                    color: var(--text-secondary, #495057);
                    font-size: 14px;
                    font-weight: var(--font-medium, 500);
                    cursor: pointer;
                    transition: var(--transition-fast, all 0.2s);
                    white-space: nowrap;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                    position: relative;
                    min-width: fit-content;
                }

                .nav-btn:hover {
                    color: var(--brand-primary, #2563eb);
                }

                .nav-btn.active {
                    color: var(--brand-primary, #2563eb);
                }

                /* PC 활성 메뉴 밑줄 */
                .nav-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 10%;
                    width: 80%;
                    height: 3px;
                    background: var(--brand-primary, #2563eb);
                    border-radius: 2px;
                }
                
                .special-btn {
                    color: var(--danger, #ef4444);
                    font-weight: var(--font-bold, 700);
                }
                
                .special-btn:hover {
                    color: #ff1744;
                }

                /* win-win */
                .legendary-btn {
                    color: #8a2be2;
                    font-weight: var(--font-bold, 700);
                }

                .legendary-btn:hover {
                    color: #7b1fa2;
                }
            }

            /* 모바일 스타일 - 3행 레이아웃 */
            @media (max-width: 768px) {
                .top-header {
                    padding: var(--space-sm, 8px) 0;
                }

                .header-spacer {
                    height: 120px;
                }

                .header-content {
                    padding: 0 15px;
                }
                
                /* 1행: 로고 + 발주시스템 */
                .mobile-top-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-md, 12px);
                }
                
                .logo-container {
                    flex-shrink: 0;
                }
                
                .logo-img {
                    height: 16px;
                    object-fit: contain;
                    cursor: pointer;
                }
                
                .order-system-btn {
                    padding: 4px 10px;
                    background: var(--danger, #ef4444);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: var(--text-sm, 12px);
                    font-weight: var(--font-semibold, 600);
                    cursor: pointer;
                    white-space: nowrap;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .order-system-btn:active {
                    background: #ff1744;
                }
                
                /* 2행, 3행: 메뉴 */
                .nav-menu-container {
                    margin: var(--space-sm, 8px) -15px 0 -15px;
                }
                
                .nav-menu {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--space-md, 12px);
                    padding: 0 15px;
                }
                
                /* 모바일 메뉴 버튼 */
                .nav-btn {
                    font-size: var(--text-sm, 12px);
                    padding: 8px 4px;
                    background: none;
                    border: none;
                    color: var(--text-secondary, #495057);
                    font-weight: var(--font-semibold, 600);
                    cursor: pointer;
                    transition: var(--transition-fast, all 0.2s);
                    white-space: nowrap;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                    text-align: center;
                    position: relative;
                    line-height: 1.2;
                }

                .nav-btn:hover {
                    color: var(--brand-primary, #2563eb);
                }

                .nav-btn.active {
                    color: var(--brand-primary, #2563eb);
                }

                /* 모바일 활성 메뉴 밑줄 */
                .nav-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 10%;
                    width: 80%;
                    height: 2px;
                    background: var(--brand-primary, #2563eb);
                    border-radius: 1px;
                }

                .special-btn {
                    display: none; /* 모바일에서는 상단에 별도 버튼으로 표시 */
                }

                /* Win-Win 특별 색상 */
                .legendary-btn {
                    color: #8a2be2;
                    font-weight: var(--font-bold, 700);
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // 헤더 HTML 생성
    function createHeader() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 모바일용 3행 레이아웃
            return `
                <!-- 헤더 스페이서 -->
                <div class="header-spacer"></div>
                
                <!-- 상단 헤더 -->
                <header class="top-header">
                    <div class="header-content">
                        <!-- 1행: 로고 + 발주시스템 -->
                        <div class="mobile-top-row">
                            <div class="logo-container">
                                <img src="https://res.cloudinary.com/dde1hpbrp/image/upload/v1753148563/05_etc/dalraemarket_papafarmers.com/DalraeMarket_loge_trans.png" 
                                     alt="달래마켓" 
                                     class="logo-img"
                                     onclick="navigateToPage('index')">
                            </div>
                            <button class="order-system-btn" onclick="openOrderSystem()">
                                발주시스템
                            </button>
                        </div>
                        
                        <!-- 2행, 3행: 메뉴 그리드 -->
                        <div class="nav-menu-container">
                            <nav class="nav-menu" id="mainMenu">
                                <!-- 2행: 4개 메뉴 -->
                                <button class="nav-btn" data-page="dashboard" onclick="navigateToPage('dashboard')">
                                    대시보드
                                </button>
                                <button class="nav-btn" data-page="products" onclick="navigateToPage('products')">
                                    상품목록
                                </button>
                                <button class="nav-btn" data-page="calendar" onclick="navigateToPage('calendar')">
                                    상품상세
                                </button>
                                <button class="nav-btn" data-page="delivery" onclick="navigateToPage('delivery')">
                                    발송달력
                                </button>
                                
                                <!-- 3행: 나머지 메뉴 -->
                                <button class="nav-btn" data-page="orders" onclick="navigateToPage('orders')">
                                    주문관리
                                </button>
                                <button class="nav-btn legendary-btn" data-page="services" onclick="navigateToPage('services')">
                                    Win-Win
                                </button>
                                <button class="nav-btn" data-page="notice" onclick="navigateToPage('notice')">
                                    공지사항
                                </button>
                                <div></div> <!-- 빈 칸 -->
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
                                 onclick="navigateTo('index.html')">
                        </div>
                        
                        <!-- 메뉴 영역 -->
                        <div class="nav-menu-container">
                            <nav class="nav-menu" id="mainMenu">
                                <button class="nav-btn special-btn" onclick="openOrderSystem()">
                                    발주시스템
                                </button>
                                <button class="nav-btn" data-page="dashboard" onclick="navigateToPage('dashboard')">
                                    대시보드
                                </button>
                                <button class="nav-btn" data-page="products" onclick="navigateToPage('products')">
                                    상품리스트
                                </button>
                                <button class="nav-btn" data-page="calendar" onclick="navigateToPage('calendar')">
                                    상품캘린더
                                </button>
                                <button class="nav-btn" data-page="delivery" onclick="navigateToPage('delivery')">
                                    발송캘린더
                                </button>
                                <button class="nav-btn" data-page="orders" onclick="navigateToPage('orders')">
                                    주문관리
                                </button>
                                <button class="nav-btn legendary-btn" data-page="services" onclick="navigateToPage('services')">
                                    Win-Win
                                </button>
                                <button class="nav-btn" data-page="notice" onclick="navigateToPage('notice')">
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
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll(`.nav-btn[data-page="${pageName}"]`).forEach(btn => {
            btn.classList.add('active');
        });
        
        saveHeaderState();
    }

    // 부드러운 페이지 이동
    window.navigateTo = function(url) {
        saveHeaderState();
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    };

    window.navigateToPage = function(page) {
        // 현재 페이지 위치 확인
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/01-pages/');
        const isRoot = !isInPagesFolder;
        
        let pageUrls = {};
        
        if (isRoot) {
            // 루트(index.html)에서 다른 페이지로 이동
            pageUrls = {
                'index': 'index.html',
                'dashboard': '01-pages/01-dashboard.html',
                'products': '01-pages/02-products.html',
                'calendar': '01-pages/03-products-calendar.html',
                'delivery': '01-pages/04-delivery-calendar.html',
                'orders': '01-pages/05-orders.html',
                'services': '01-pages/06-services.html',
                'notice': '01-pages/07-notice.html'
            };
        } else {
            // 01-pages 폴더 내에서 이동
            pageUrls = {
                'index': '../index.html',
                'dashboard': '01-dashboard.html',
                'products': '02-products.html',
                'calendar': '03-products-calendar.html',
                'delivery': '04-delivery-calendar.html',
                'orders': '05-orders.html',
                'services': '06-services.html',
                'notice': '07-notice.html'
            };
        }
        
        const targetFile = pageUrls[page];
        if (targetFile) {
            window.location.href = targetFile;
        }
    };

    // 발주시스템 열기
    window.openOrderSystem = function() {
        window.open('https://papafarmers.com/orders/', '_blank');
    };

    // 현재 페이지 이름 가져오기
    function getCurrentPageName() {
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        
        // 파일명과 페이지 이름 매핑
        const fileToPage = {
            'index.html': 'index',
            '01-dashboard.html': 'dashboard',
            '02-products.html': 'products',
            '03-products-calendar.html': 'calendar',
            '04-delivery-calendar.html': 'delivery',
            '05-orders.html': 'orders',
            '06-services.html': 'services',
            '07-notice.html': 'notice'
        };
        
        return fileToPage[currentFile] || 'index';
    }

    // 헤더 초기화
    function initHeader(options = {}) {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        window.scrollTo(0, 0);
        
        createHeaderStyles();
        
        const { 
            containerId = 'header-container',
            activePage = null
        } = options;
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`헤더 컨테이너 '${containerId}'를 찾을 수 없습니다`);
            return;
        }
        
        container.innerHTML = createHeader();
        
        // 활성 페이지 설정
        if (activePage) {
            setActivePage(activePage);
        } else {
            const currentPageName = getCurrentPageName();
            setActivePage(currentPageName);
        }

        // 화면 크기 변경 시 헤더 재생성
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const currentWidth = window.innerWidth;
                const isMobile = currentWidth <= 768;
                const container = document.getElementById(containerId);
                
                if (container) {
                    const currentActivePage = document.querySelector('.nav-btn.active')?.dataset.page;
                    container.innerHTML = createHeader();
                    
                    if (currentActivePage) {
                        setActivePage(currentActivePage);
                    }
                }
            }, 250);
        });
    }

    // DOM이 로드되면 자동 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById('header-container')) {
                initHeader();
            }
        });
    } else {
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
