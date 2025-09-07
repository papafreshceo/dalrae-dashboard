// header.js - 달래마켓 공통 헤더
(function() {
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
        const header = document.querySelector('.top-header');
        const menuContainer = document.getElementById('menuContainer');
        const menuWrapper = document.getElementById('menuWrapper');
        const mainMenu = document.getElementById('mainMenu');
        const centerButton = document.querySelector('.center-button');
        
        if (!header || !menuContainer || !menuWrapper || !mainMenu || !centerButton) {
            console.error('헤더 요소를 찾을 수 없습니다');
            return;
        }
        
        let headerHeight = header.offsetHeight;
        let stickyOffset = header.offsetTop + headerHeight;
        
        window.addEventListener('scroll', function() {
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
                }
            } else {
                menuContainer.classList.remove('sticky');
                menuWrapper.style.display = 'none';
            }
        });
    }

    // 메뉴 클릭 처리
    function handleMenuClick(e) {
        const btn = e.currentTarget;
        const page = btn.dataset.page;
        
        if (page) {
            // 페이지 매핑
            const pageUrls = {
                'dashboard': 'dashboard.html',
                'products': 'products.html',
                'calendar': 'calendar.html',
                'orders': 'orders.html',
                'services': 'services.html',
                'notice': 'notice.html'
            };
            
            if (pageUrls[page]) {
                // 현재 페이지가 아닌 경우에만 이동
                const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
                if (currentPage !== page) {
                    window.location.href = pageUrls[page];
                }
            }
        }
    }

    // 헤더 초기화
    function initHeader(options = {}) {
        // 옵션 설정
        const { 
            containerId = 'header-container',
            activePage = null,
            enableStickyMenu = true  // 스티키 메뉴 활성화 옵션 추가
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
            const currentFile = window.location.pathname.split('/').pop();
            const pageName = currentFile.replace('.html', '') || 'dashboard';
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

    // 전역으로 내보내기
    window.DalraeHeader = {
        init: initHeader,
        setActivePage: setActivePage
    };
})();
