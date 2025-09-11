// header.js - 달래마켓 공통 헤더 (단순화 버전)
(function() {
    // 페이지 전환 전 상태 저장
    function saveHeaderState() {
        const activePage = document.querySelector('.nav-btn.active')?.dataset.page || 'dashboard';
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
                background: white;
                border-bottom: 1px solid #e8e9eb;
                padding: 12px 0;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
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
                    margin-right: 50px;
                }

                .logo-img { 
                    height: 32px;
                    object-fit: contain;
                    cursor: pointer;
                }

                .nav-menu-container {
                    flex: 1;
                    overflow: visible;
                }

                .nav-menu { 
                    display: flex; 
                    gap: 12px;
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
                    transition: color 0.3s ease;
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

                /* PC 활성 메뉴 밑줄 */
                .nav-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 10%;
                    width: 80%;
                    height: 3px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 2px;
                }
                

                
                .special-btn:hover {
                    color: #ff5252;
                }

                /* 서비스&프로그램 특별 색상 (애니메이션 제거) */
                .legendary-btn {
                    color: #8a2be2;
                    font-weight: 700;
                }

                .legendary-btn:hover {
                    color: #7b1fa2;
                }
            }

            /* 모바일 스타일 - 2행 레이아웃 */
            @media (max-width: 768px) {
                .top-header {
                    padding: 5px 0;
                }

                .header-spacer {
                    height: 60px;
                }

                .header-content {
                    padding: 0 15px;
                }
                
                /* 모바일 로고 영역 - 좌측 정렬 */
                .logo-container {
                    text-align: left;
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
                    gap: 10px;
                    justify-content: flex-start;
                    padding: 0 15px; /* 좌우 패딩 추가로 맨 좌측에서 시작 */
                    min-width: fit-content;
                }
                
                /* 모바일 메뉴 - 텍스트만 표시 */
                .nav-btn {
                    font-size: 14px;
                    padding: 5px 8px;
                    flex-shrink: 0;
                    background: none;
                    border: none;
                    color: #5a5c60;
                    font-weight: 600;
                    cursor: pointer;
                    transition: color 0.3s ease;
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

                /* 모바일 활성 메뉴 밑줄 */
                .nav-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 10%;
                    width: 80%;
                    height: 2px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 1px;
                }

                /* 발주시스템 특별 색상 (애니메이션 제거) */
                .special-btn {
                    color: #ff6b6b;
                    font-weight: 700;
                }

                /* 서비스&프로그램 특별 색상 (애니메이션 제거) */
                .legendary-btn {
                    color: #8a2be2;
                    font-weight: 700;
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
                                 onclick="navigateTo('index.html')">
                        </div>
                        
                        <!-- 메뉴 영역 (2행) -->
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
                                    캘린더
                                </button>
                                <button class="nav-btn" data-page="delivery" onclick="navigateToPage('delivery')">
                                    배송일정
                                </button>
                                <button class="nav-btn" data-page="orders" onclick="navigateToPage('orders')">
                                    주문관리
                                </button>
                                <button class="nav-btn legendary-btn" data-page="services" onclick="navigateToPage('services')">
                                    서비스&프로그램
                                </button>
                                <button class="nav-btn" data-page="notice" onclick="navigateToPage('notice')">
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
                                    배송캘린더
                                </button>
                                <button class="nav-btn" data-page="orders" onclick="navigateToPage('orders')">
                                    주문관리
                                </button>
                                <button class="nav-btn legendary-btn" data-page="services" onclick="navigateToPage('services')">
                                    서비스&프로그램
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
        // 모든 nav-btn에서 active 클래스 제거
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 현재 페이지 버튼에 active 클래스 추가
        document.querySelectorAll(`.nav-btn[data-page="${pageName}"]`).forEach(btn => {
            btn.classList.add('active');
        });
        
        // 상태 저장
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
        const pageUrls = {
            'dashboard': 'index.html',
            'products': 'products.html',
            'calendar': 'calendar.html',
            'delivery': 'delivery.html',
            'orders': 'orders.html',
            'services': 'services.html',
            'notice': 'notice.html'
        };
        
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        const currentPage = currentFile.replace('.html', '');
        const currentPageName = currentPage === 'index' ? 'dashboard' : currentPage;
        
        if (currentPageName !== page) {
            navigateTo(pageUrls[page]);
        }
    };

    // 발주시스템 열기
    window.openOrderSystem = function() {
        window.open('https://papafarmers.com/orders/', '_blank');
    };

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
        
        // 저장된 상태 복원 또는 현재 페이지 활성화
        const savedPage = localStorage.getItem('dalrae_active_page');
        if (activePage) {
            setActivePage(activePage);
        } else if (savedPage) {
            setActivePage(savedPage);
        } else {
            // URL에서 현재 페이지 추출
            const currentFile = window.location.pathname.split('/').pop() || 'index.html';
            const pageName = currentFile === 'index.html' ? 'dashboard' : currentFile.replace('.html', '');
            setActivePage(pageName);
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
                    // 현재 활성 페이지 저장
                    const currentActivePage = document.querySelector('.nav-btn.active')?.dataset.page;
                    
                    // 헤더 재생성
                    container.innerHTML = createHeader();
                    
                    // 활성 페이지 복원
                    if (currentActivePage) {
                        setActivePage(currentActivePage);
                    }
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


