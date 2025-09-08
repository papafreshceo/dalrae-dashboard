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

            /* 헤더 */
            .top-header {
                background: white;
                border-bottom: 1px solid #e8e9eb;
                padding: 20px 0;
                position: relative;
                z-index: 100;
            }

            .header-content {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 30px;
                display: grid;
                grid-template-columns: 200px 1fr auto;
                align-items: center;
                gap: 20px;
            }

            .logo-img { 
                height: 36px;
                object-fit: contain;
                cursor: pointer;
            }

            /* 메뉴 고정용 컨테이너 */
            .menu-container {
                position: relative;
                background: white;
                transition: all 0.3s;
            }

            .menu-container.sticky {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 200;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                padding: 10px 0;
            }

            .menu-wrapper {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 30px;
                display: flex;
                justify-content: center;
                gap: 20px;
            }

            .center-button {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .nav-menu { 
                display: flex; 
                gap: 8px;
            }

            .nav-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 10px 16px;
                background: white;
                border: 1px solid #e1e3e5;
                border-radius: 8px;
                color: #5a5c60;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
                font-family: 'Noto Sans KR', -apple-system, sans-serif;
            }

            .nav-btn:hover {
                background: #f5f6f7;
                border-color: #667eea;
                color: #667eea;
            }

            .nav-btn.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: transparent;
            }

            /* 발주시스템 특별 스타일 */
            .special-btn {
                padding: 10px 24px;
                background: linear-gradient(270deg, #ffffff, #ff9a9e, #fecfef, #a8e6cf, #ffffff);
                background-size: 400% 100%;
                color: #333;
                border: none;
                font-weight: 600;
                animation: shine 3.75s ease-in-out infinite;
                position: relative;
                overflow: hidden;
            }

            @keyframes shine {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            .special-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(255, 154, 158, 0.4);
            }

            /* 모바일 반응형 */
            @media (max-width: 768px) {
                .top-header {
                    padding: 15px 0;
                }
                
                .logo-img {
                    height: 22px;
                }
                
                .header-content {
                    grid-template-columns: 1fr;
                    gap: 15px;
                    padding: 0 15px;
                }
                
                .menu-container.sticky .menu-wrapper {
                    padding: 0 10px;
                    gap: 8px;
                }
                
                .center-button {
                    order: -1;
                }
                
                .nav-menu {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 4px;
                    width: 100%;
                }
                
                .nav-btn {
                    padding: 6px 4px;
                    font-size: 11px;
                }
                
                .nav-btn span {
                    display: inline-block;
                    white-space: nowrap;
                }
                
                .special-btn {
                    width: 100%;
                    padding: 8px 12px;
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
            <!-- 상단 헤더 -->
            <header class="top-header">
                <div class="header-content">
                    <img src="https://res.cloudinary.com/dde1hpbrp/image/upload/v1753148563/05_etc/dalraemarket_papafarmers.com/DalraeMarket_loge_trans.png" 
                         alt="달래마켓" 
                         class="logo-img">
                    <div class="center-button">
                        <button class="nav-btn special-btn" onclick="openOrderSystem()">
                            <span>🚜</span>
                            <span>발주시스템</span>
                        </button>
                    </div>
                    <nav class="nav-menu" id="mainMenu">
                        <button class="nav-btn" data-page="dashboard">
                            <span>📊</span>
                            <span>대시보드</span>
                        </button>
                        <button class="nav-btn" data-page="products">
                            <span>📦</span>
                            <span>상품리스트</span>
                        </button>
                        <button class="nav-btn" data-page="calendar">
                            <span>📅</span>
                            <span>상품캘린더</span>
                        </button>
                        <button class="nav-btn" data-page="delivery">
                            <span>🚚</span>
                            <span>배송캘린더</span>
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
            </header>

            <!-- 메뉴 고정 컨테이너 (스크롤 시 스티키) -->
            <div class="menu-container" id="menuContainer">
                <div class="menu-wrapper" id="menuWrapper" style="display: none;">
                    <!-- 스크롤 시 여기에 메뉴 복사 -->
                </div>
            </div>
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

    // 스티키 메뉴 설정
    function setupStickyMenu() {
        // DOM이 완전히 로드된 후 실행
        setTimeout(() => {
            const header = document.querySelector('.top-header');
            const menuContainer = document.getElementById('menuContainer');
            const menuWrapper = document.getElementById('menuWrapper');
            const mainMenu = document.getElementById('mainMenu');
            const centerButton = document.querySelector('.center-button');
            
            if (!header || !menuContainer || !menuWrapper || !mainMenu || !centerButton) {
                console.warn('헤더 요소를 찾을 수 없습니다 - 스티키 메뉴 비활성화');
                return;
            }
            
            let headerHeight = header.offsetHeight;
            let stickyOffset = header.offsetTop + headerHeight;
            
            // 기존 스크롤 이벤트 리스너 제거 (중복 방지)
            window.removeEventListener('scroll', window.dalraeStickyHandler);
            
            // 새 스크롤 핸들러 정의
            window.dalraeStickyHandler = function() {
                if (window.pageYOffset > stickyOffset) {
                    if (!menuContainer.classList.contains('sticky')) {
                        menuContainer.classList.add('sticky');
                        menuWrapper.style.display = 'flex';
                        
                        // 메뉴 복사
                        menuWrapper.innerHTML = '';
                        
                        // 중앙 버튼 복사
                        const centerButtonClone = centerButton.cloneNode(true);
                        menuWrapper.appendChild(centerButtonClone);
                        
                        // 메인 메뉴 복사
                        const mainMenuClone = mainMenu.cloneNode(true);
                        menuWrapper.appendChild(mainMenuClone);
                        
                        // 이벤트 리스너 재설정
                        centerButtonClone.querySelector('.special-btn').onclick = openOrderSystem;
                        
                        // 메뉴 클릭 이벤트 재설정
                        mainMenuClone.querySelectorAll('.nav-btn').forEach(btn => {
                            btn.addEventListener('click', handleMenuClick);
                        });
                        
                        // 현재 페이지 활성화 상태 유지
                        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
                        const pageName = currentFile === 'index.html' ? 'dashboard' : currentFile.replace('.html', '');
                        mainMenuClone.querySelectorAll('.nav-btn').forEach(btn => {
                            if (btn.dataset.page === pageName) {
                                btn.classList.add('active');
                            }
                        });
                    }
                } else {
                    menuContainer.classList.remove('sticky');
                    menuWrapper.style.display = 'none';
                }
            };
            
            // 스크롤 이벤트 리스너 추가
            window.addEventListener('scroll', window.dalraeStickyHandler);
        }, 100);
    }

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
            activePage = null,
            enableStickyMenu = true  // 스티키 메뉴 활성화 옵션
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
        
        // 스티키 메뉴 설정 (옵션에 따라)
        if (enableStickyMenu) {
            setupStickyMenu();
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
