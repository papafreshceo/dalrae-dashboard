// ========== DELIVERY CALENDAR PAGE ===========

// 전역 변수
let currentView = 'month';
let currentDate = new Date();
let deliveryData = {};
let holidays = {};

// API 관련 함수
const DeliveryAPI = {
    async fetchDeliveryData() {
        try {
            const response = await fetch('/api/delivery-data');
            if (!response.ok) throw new Error('배송 데이터 로드 실패');
            return await response.json();
        } catch (error) {
            console.error('배송 데이터 API 오류:', error);
            return this.getMockDeliveryData();
        }
    },
    
    async fetchHolidayData() {
        try {
            const response = await fetch('/api/holidays');
            if (!response.ok) throw new Error('공휴일 데이터 로드 실패');
            return await response.json();
        } catch (error) {
            console.error('공휴일 API 오류:', error);
            return this.getMockHolidayData();
        }
    },
    
    getMockDeliveryData() {
        return {
            '2025-01-01': { canDeliver: false, type: 'holiday', reason: '신정' },
            '2025-01-28': { canDeliver: false, type: 'holiday', reason: '설날' },
            '2025-01-29': { canDeliver: false, type: 'holiday', reason: '설날' },
            '2025-01-30': { canDeliver: false, type: 'holiday', reason: '설날' }
        };
    },
    
    getMockHolidayData() {
        return {
            '2025-01-01': '신정',
            '2025-01-28': '설날',
            '2025-01-29': '설날',
            '2025-01-30': '설날',
            '2025-03-01': '삼일절',
            '2025-05-05': '어린이날'
        };
    }
};

// 캘린더 렌더링 함수
const MonthCalendar = {
    render(container, date, deliveryData, holidays) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        const html = this.generateMonthHTML(year, month, deliveryData, holidays);
        container.innerHTML = html;
        
        // 네비게이션 버튼 이벤트 재설정
        setupNavigationEvents();
    },
    
    generateMonthHTML(year, month, deliveryData, holidays) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        
        const startDate = firstDay.getDay();
        const lastDate = lastDay.getDate();
        const prevLastDate = prevLastDay.getDate();
        
        let html = `
            <div class="calendar-nav">
                <button class="nav-btn" id="prevBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h2 class="month-title">${year}년 ${month + 1}월</h2>
                <button class="nav-btn" id="nextBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
            <div class="calendar-grid">
        `;
        
        // 요일 헤더
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        dayNames.forEach((day, index) => {
            let className = 'day-header';
            if (index === 0) className += ' sunday';
            if (index === 6) className += ' saturday';
            html += `<div class="${className}">${day}</div>`;
        });
        
        // 이전 달 날짜
        for (let i = startDate - 1; i >= 0; i--) {
            html += `<div class="day-cell other-month">
                <div class="day-number">${prevLastDate - i}</div>
            </div>`;
        }
        
        // 현재 달 날짜
        const today = new Date();
        for (let date = 1; date <= lastDate; date++) {
            const currentDate = new Date(year, month, date);
            const dateStr = this.formatDate(currentDate);
            const dayOfWeek = currentDate.getDay();
            
            let cellClass = 'day-cell';
            let numberClass = 'day-number';
            
            // 오늘 날짜 체크
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                date === today.getDate()) {
                cellClass += ' today';
            }
            
            // 주말 체크
            if (dayOfWeek === 0) numberClass += ' sunday';
            if (dayOfWeek === 6) numberClass += ' saturday';
            
            // 공휴일 체크
            if (holidays[dateStr]) {
                numberClass += ' holiday';
            }
            
            // 배송 아이콘 결정
            let deliveryIcon = '';
            const delivery = deliveryData[dateStr];
            if (delivery) {
                if (delivery.canDeliver === false) {
                    deliveryIcon = this.getDeliveryIcon('unavailable');
                } else if (delivery.type === 'special') {
                    deliveryIcon = this.getDeliveryIcon('special');
                } else {
                    deliveryIcon = this.getDeliveryIcon('available');
                }
            } else if (dayOfWeek === 0 || dayOfWeek === 6) {
                deliveryIcon = this.getDeliveryIcon('unavailable');
            } else {
                deliveryIcon = this.getDeliveryIcon('available');
            }
            
            // 배지 추가
            let badges = '';
            if (holidays[dateStr]) {
                badges += `<span class="badge holiday">${holidays[dateStr]}</span>`;
            }
            
            html += `
                <div class="${cellClass}" data-date="${dateStr}">
                    <div class="${numberClass}">${date}</div>
                    ${badges ? `<div class="day-badges">${badges}</div>` : ''}
                    ${deliveryIcon}
                </div>
            `;
        }
        
        // 다음 달 날짜
        const remainingCells = 42 - (startDate + lastDate);
        for (let date = 1; date <= remainingCells; date++) {
            html += `<div class="day-cell other-month">
                <div class="day-number">${date}</div>
            </div>`;
        }
        
        html += '</div>';
        return html;
    },
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    
    getDeliveryIcon(type) {
        const icons = {
            available: `
                <div class="delivery-icon available">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            `,
            unavailable: `
                <div class="delivery-icon unavailable">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            `,
            special: `
                <div class="delivery-icon special">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                </div>
            `
        };
        return icons[type] || '';
    }
};

// 연도 캘린더
const YearCalendar = {
    render(container, date, deliveryData, holidays) {
        const year = date.getFullYear();
        const html = this.generateYearHTML(year, deliveryData, holidays);
        container.innerHTML = html;
        
        // 네비게이션 버튼 이벤트 재설정
        setupNavigationEvents();
    },
    
    generateYearHTML(year, deliveryData, holidays) {
        let html = `
            <div class="calendar-nav">
                <button class="nav-btn" id="prevBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h2 class="month-title">${year}년</h2>
                <button class="nav-btn" id="nextBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
            <div class="year-grid">
        `;
        
        for (let month = 0; month < 12; month++) {
            html += this.generateMiniMonth(year, month, deliveryData, holidays);
        }
        
        html += '</div>';
        return html;
    },
    
    generateMiniMonth(year, month, deliveryData, holidays) {
        const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', 
                          '7월', '8월', '9월', '10월', '11월', '12월'];
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = firstDay.getDay();
        const lastDate = lastDay.getDate();
        
        let html = `
            <div class="month-card">
                <div class="month-card-header">
                    <h3 class="month-card-title">${monthNames[month]}</h3>
                </div>
                <div class="mini-calendar-grid">
        `;
        
        // 요일 헤더
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        dayNames.forEach(day => {
            html += `<div class="mini-day-header">${day.charAt(0)}</div>`;
        });
        
        // 빈 셀
        for (let i = 0; i < startDate; i++) {
            html += '<div class="mini-day-cell"></div>';
        }
        
        // 날짜
        for (let date = 1; date <= lastDate; date++) {
            const currentDate = new Date(year, month, date);
            const dateStr = this.formatDate(currentDate);
            const dayOfWeek = currentDate.getDay();
            
            let cellClass = 'mini-day-cell';
            
            // 배송 가능 여부 체크
            const delivery = deliveryData[dateStr];
            if (delivery) {
                if (delivery.canDeliver === false) {
                    cellClass += ' no-delivery';
                } else if (delivery.type === 'special') {
                    cellClass += ' delivery-special';
                } else {
                    cellClass += ' delivery-available';
                }
            } else if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                cellClass += ' delivery-available';
            }
            
            html += `<div class="${cellClass}">${date}</div>`;
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    },
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};

// 공지사항 관리
const NoticeManager = {
    notices: [
        { type: 'info', message: '설 연휴 배송 일정이 변경되었습니다.' },
        { type: 'warning', message: '1월 27일 ~ 30일은 배송이 없습니다.' }
    ],
    
    loadNotices() {
        const container = document.getElementById('noticesList');
        if (!container) return;
        
        let html = '';
        this.notices.forEach(notice => {
            html += `
                <div class="notice-item ${notice.type}">
                    ${notice.message}
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
};

// 초기화 함수
async function initDeliveryCalendar() {
    console.log('배송 캘린더 초기화 시작');
    
    // 헤더 초기화
    if (window.DalraeHeader) {
        DalraeHeader.init({
            containerId: 'header-container',
            activePage: 'delivery'
        });
    }
    
    // 푸터 초기화
    if (window.DalraeFooter) {
        DalraeFooter.init({
            containerId: 'footer-container'
        });
    }
    
    // 데이터 로드
    await loadInitialData();
    
    // 공지사항 로드
    NoticeManager.loadNotices();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 렌더링
    renderCalendar();
}

// 초기 데이터 로드
async function loadInitialData() {
    try {
        // 배송 데이터 로드
        const deliveryResponse = await DeliveryAPI.fetchDeliveryData();
        if (deliveryResponse) {
            deliveryData = deliveryResponse;
        }
        
        // 공휴일 데이터 로드
        const holidayResponse = await DeliveryAPI.fetchHolidayData();
        if (holidayResponse) {
            holidays = holidayResponse;
        }
        
        console.log('데이터 로드 완료', { deliveryData, holidays });
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 뷰 토글 버튼
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            if (view && view !== currentView) {
                switchView(view);
            }
        });
    });
}

// 네비게이션 이벤트 설정
function setupNavigationEvents() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentView === 'month') {
                currentDate.setMonth(currentDate.getMonth() - 1);
            } else {
                currentDate.setFullYear(currentDate.getFullYear() - 1);
            }
            renderCalendar();
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentView === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
            renderCalendar();
        };
    }
}

// 뷰 전환
function switchView(view) {
    currentView = view;
    
    // 버튼 활성화 상태 변경
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
    
    // 캘린더 렌더링
    renderCalendar();
}

// 캘린더 렌더링
function renderCalendar() {
    const container = document.getElementById('deliveryCalendarContent');
    if (!container) return;
    
    if (currentView === 'month') {
        MonthCalendar.render(container, currentDate, deliveryData, holidays);
    } else if (currentView === 'year') {
        YearCalendar.render(container, currentDate, deliveryData, holidays);
    }
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', initDeliveryCalendar);