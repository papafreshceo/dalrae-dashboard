// ========== DELIVERY CALENDAR PAGE MAIN ===========
import { DeliveryAPI } from '../02-modules/delivery-calendar/delivery-api.js';
import { CalendarView } from '../02-modules/delivery-calendar/calendar-view.js';
import { MonthCalendar } from '../02-modules/delivery-calendar/month-calendar.js';
import { YearCalendar } from '../02-modules/delivery-calendar/year-calendar.js';
import { NoticeManager } from '../02-modules/delivery-calendar/notice-manager.js';
import { CalendarNavigation } from '../02-modules/delivery-calendar/calendar-navigation.js';

// 전역 변수
let currentView = 'month';
let currentDate = new Date();
let deliveryData = {};
let holidays = {};

// 초기화
window.addEventListener('DOMContentLoaded', async function() {
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
    
    // 뷰 초기화
    CalendarView.init(currentView);
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 렌더링
    renderCalendar();
});

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
    
    // 네비게이션 버튼
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const todayBtn = document.getElementById('todayBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            CalendarNavigation.navigatePrev(currentView, currentDate);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            CalendarNavigation.navigateNext(currentView, currentDate);
            renderCalendar();
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            renderCalendar();
        });
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
    
    // 뷰 변경
    CalendarView.switchView(view);
    
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
    
    // 네비게이션 타이틀 업데이트
    updateNavigationTitle();
}

// 네비게이션 타이틀 업데이트
function updateNavigationTitle() {
    const titleElement = document.querySelector('.month-title');
    if (!titleElement) return;
    
    if (currentView === 'month') {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        titleElement.textContent = `${year}년 ${month}월`;
    } else if (currentView === 'year') {
        const year = currentDate.getFullYear();
        titleElement.textContent = `${year}년`;
    }
}

// 전역 함수 등록
window.switchDeliveryView = switchView;