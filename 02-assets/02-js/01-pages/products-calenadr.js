/**
 * products-calendar.js
 * 상품 캘린더 페이지 메인 모듈
 */

import { CalendarAPI } from '../02-modules/products-calendar/calendar-api.js';
import { CalendarView } from '../02-modules/products-calendar/calendar-view.js';
import { MonthCalendar } from '../02-modules/products-calendar/month-calendar.js';
import { YearCalendar } from '../02-modules/products-calendar/year-calendar.js';
import { CalendarModal } from '../02-modules/products-calendar/calendar-modal.js';
import { CalendarChart } from '../02-modules/products-calendar/calendar-chart.js';

class ProductsCalendarManager {
    constructor() {
        // 모듈 초기화
        this.api = new CalendarAPI();
        this.view = new CalendarView();
        this.monthCalendar = new MonthCalendar();
        this.yearCalendar = new YearCalendar();
        this.modal = new CalendarModal();
        this.chart = new CalendarChart();
        
        // 상태 관리
        this.state = {
            currentView: 'month',
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            products: [],
            calendarData: [],
            selectedProduct: null,
            priceDataCache: {}
        };
    }
    
    /**
     * 초기화
     */
    async init() {
        try {
            // 공통 컴포넌트 초기화
            this.initializeCommonComponents();
            
            // 데이터 로드
            await this.loadCalendarData();
            
            // 뷰 초기화
            this.initializeViews();
            
            // 이벤트 리스너 설정
            this.setupEventListeners();
            
            // 초기 렌더링
            this.render();
            
        } catch (error) {
            console.error('캘린더 초기화 실패:', error);
            this.showError('캘린더 데이터를 불러올 수 없습니다.');
        }
    }
    
    /**
     * 공통 컴포넌트 초기화
     */
    initializeCommonComponents() {
        // 헤더 초기화
        if (window.DalraeHeader) {
            window.DalraeHeader.init({
                containerId: 'header-container',
                activePage: 'calendar'
            });
        }
        
        // 푸터 초기화
        if (window.DalraeFooter) {
            window.DalraeFooter.init({
                containerId: 'footer-container'
            });
        }
        
        // 공지사항 초기화
        if (window.GlobalNotice) {
            window.GlobalNotice.init({
                containerId: 'notice-container'
            });
        }
    }
    
    /**
     * 캘린더 데이터 로드
     */
    async loadCalendarData() {
        // 상품 데이터 로드
        const products = await this.api.fetchProducts();
        this.state.products = products;
        
        // 캘린더 이벤트 데이터 생성
        this.state.calendarData = this.processCalendarData(products);
    }
    
    /**
     * 캘린더 데이터 처리
     */
    processCalendarData(products) {
        const events = [];
        
        products.forEach(product => {
            // 시작일과 종료일 파싱
            const startDate = this.parseSeasonDate(product.시즌시작);
            const endDate = this.parseSeasonDate(product.시즌종료);
            
            if (startDate && endDate) {
                events.push({
                    id: product.상품코드,
                    title: product.상품명,
                    variety: product.품종,
                    startDate: startDate,
                    endDate: endDate,
                    status: product.공급상태_통합 || product.공급상태,
                    category: product.품목,
                    thumbnail: product.썸네일,
                    price: product.공급가,
                    freeShipping: product.무료배송 === 'O',
                    product: product
                });
            }
        });
        
        return events;
    }
    
    /**
     * 뷰 초기화
     */
    initializeViews() {
        // 월별 캘린더 초기화
        this.monthCalendar.init({
            container: document.getElementById('monthView'),
            onEventClick: (event) => this.handleEventClick(event),
            onDateClick: (date) => this.handleDateClick(date)
        });
        
        // 연간 캘린더 초기화
        this.yearCalendar.init({
            container: document.getElementById('yearView'),
            onEventClick: (event) => this.handleEventClick(event),
            onMonthClick: (month) => this.handleMonthClick(month)
        });
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 뷰 전환 버튼
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });
        
        // 네비게이션 버튼
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const todayBtn = document.getElementById('todayBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigatePrev());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateNext());
        }
        
        if (todayBtn) {
            todayBtn.addEventListener('click', () => this.navigateToday());
        }
        
        // 모달 이벤트
        this.setupModalEvents();
        
        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigatePrev();
            } else if (e.key === 'ArrowRight') {
                this.navigateNext();
            } else if (e.key === 'Escape') {
                this.modal.hide();
            }
        });
    }
    
    /**
     * 모달 이벤트 설정
     */
    setupModalEvents() {
        // 상품 모달 이벤트
        document.addEventListener('show-modal', (e) => {
            const variety = e.detail.variety;
            this.showProductModal(variety);
        });
        
        // 툴팁 이벤트
        document.addEventListener('show-tooltip', (e) => {
            if (window.TooltipManager) {
                window.TooltipManager.showProduct(e.detail);
            }
        });
        
        document.addEventListener('hide-tooltip', () => {
            if (window.TooltipManager) {
                window.TooltipManager.hide();
            }
        });
        
        // 가격 차트 이벤트
        document.addEventListener('show-price-chart', (e) => {
            const { optionCode, optionName } = e.detail;
            this.showPriceChart(optionCode, optionName);
        });
    }
    
    /**
     * 뷰 전환
     */
    switchView(view) {
        this.state.currentView = view;
        
        // 버튼 활성화 상태
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // 뷰 표시/숨김
        document.querySelectorAll('.calendar-view').forEach(v => {
            v.classList.remove('active');
        });
        
        if (view === 'month') {
            document.getElementById('monthView').classList.add('active');
            this.monthCalendar.render(this.state.calendarData, {
                month: this.state.currentMonth,
                year: this.state.currentYear
            });
        } else {
            document.getElementById('yearView').classList.add('active');
            this.yearCalendar.render(this.state.calendarData, {
                year: this.state.currentYear
            });
            
            // 모바일에서 오늘 위치로 스크롤
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.yearCalendar.scrollToToday();
                }, 100);
            }
        }
        
        this.updateNavigationTitle();
    }
    
    /**
     * 이전 이동
     */
    navigatePrev() {
        if (this.state.currentView === 'month') {
            this.state.currentMonth--;
            if (this.state.currentMonth < 0) {
                this.state.currentMonth = 11;
                this.state.currentYear--;
            }
        } else {
            this.state.currentYear--;
        }
        
        this.render();
    }
    
    /**
     * 다음 이동
     */
    navigateNext() {
        if (this.state.currentView === 'month') {
            this.state.currentMonth++;
            if (this.state.currentMonth > 11) {
                this.state.currentMonth = 0;
                this.state.currentYear++;
            }
        } else {
            this.state.currentYear++;
        }
        
        this.render();
    }
    
    /**
     * 오늘로 이동
     */
    navigateToday() {
        const today = new Date();
        this.state.currentMonth = today.getMonth();
        this.state.currentYear = today.getFullYear();
        
        this.render();
        
        // 오늘 날짜 강조
        if (this.state.currentView === 'month') {
            this.monthCalendar.highlightToday();
        } else {
            this.yearCalendar.scrollToToday();
        }
    }
    
    /**
     * 네비게이션 제목 업데이트
     */
    updateNavigationTitle() {
        const titleEl = document.getElementById('calendarTitle');
        if (!titleEl) return;
        
        if (this.state.currentView === 'month') {
            const monthNames = [
                '1월', '2월', '3월', '4월', '5월', '6월',
                '7월', '8월', '9월', '10월', '11월', '12월'
            ];
            titleEl.textContent = `${this.state.currentYear}년 ${monthNames[this.state.currentMonth]}`;
        } else {
            titleEl.textContent = `${this.state.currentYear}년`;
        }
    }
    
    /**
     * 렌더링
     */
    render() {
        if (this.state.currentView === 'month') {
            this.monthCalendar.render(this.state.calendarData, {
                month: this.state.currentMonth,
                year: this.state.currentYear
            });
        } else {
            this.yearCalendar.render(this.state.calendarData, {
                year: this.state.currentYear
            });
        }
        
        this.updateNavigationTitle();
    }
    
    /**
     * 이벤트 클릭 처리
     */
    handleEventClick(event) {
        this.showProductModal(event.variety || event.title);
    }
    
    /**
     * 날짜 클릭 처리
     */
    handleDateClick(date) {
        // 해당 날짜의 이벤트 찾기
        const events = this.getEventsForDate(date);
        
        if (events.length === 1) {
            this.showProductModal(events[0].variety || events[0].title);
        } else if (events.length > 1) {
            // 여러 이벤트가 있으면 선택 모달 표시
            this.showEventSelectionModal(events, date);
        }
    }
    
    /**
     * 월 클릭 처리
     */
    handleMonthClick(month) {
        this.state.currentMonth = month;
        this.switchView('month');
    }
    
    /**
     * 날짜별 이벤트 가져오기
     */
    getEventsForDate(date) {
        return this.state.calendarData.filter(event => {
            return date >= event.startDate && date <= event.endDate;
        });
    }
    
    /**
     * 상품 모달 표시
     */
    async showProductModal(variety) {
        // 해당 품종의 상품 찾기
        const products = this.state.products.filter(p => 
            p.품종 === variety || p.상품명 === variety
        );
        
        if (products.length > 0) {
            this.modal.showProducts(variety, products);
        } else {
            this.modal.showNoData(variety);
        }
    }
    
    /**
     * 이벤트 선택 모달 표시
     */
    showEventSelectionModal(events, date) {
        this.modal.showEventSelection(events, date);
    }
    
    /**
     * 가격 차트 표시
     */
    async showPriceChart(optionCode, optionName) {
        try {
            // 캐시 확인
            let data = this.state.priceDataCache[optionCode];
            
            if (!data) {
                // API 호출
                data = await this.api.fetchPriceHistory(optionCode);
                this.state.priceDataCache[optionCode] = data;
            }
            
            // 차트 표시
            this.chart.show(data, optionName);
            
        } catch (error) {
            console.error('가격 차트 로드 실패:', error);
            alert('가격 데이터를 불러올 수 없습니다.');
        }
    }
    
    /**
     * 시즌 날짜 파싱
     */
    parseSeasonDate(dateStr) {
        if (!dateStr) return null;
        
        // MM-DD 형식
        if (dateStr.length === 5 && dateStr.indexOf('-') === 2) {
            const month = parseInt(dateStr.slice(0, 2)) - 1;
            const day = parseInt(dateStr.slice(3, 5));
            const year = this.state.currentYear;
            
            return new Date(year, month, day);
        }
        
        // YYYY-MM-DD 형식
        return new Date(dateStr);
    }
    
    /**
     * 에러 표시
     */
    showError(message) {
        const monthView = document.getElementById('monthView');
        const yearView = document.getElementById('yearView');
        
        const errorHtml = `
            <div class="calendar-error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
            </div>
        `;
        
        if (monthView) monthView.innerHTML = errorHtml;
        if (yearView) yearView.innerHTML = errorHtml;
    }
}

// 전역 인스턴스
let calendarManager = null;

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    calendarManager = new ProductsCalendarManager();
    calendarManager.init();
});

// 전역 함수 내보내기
window.productsCalendar = {
    refresh: () => calendarManager?.loadCalendarData(),
    switchView: (view) => calendarManager?.switchView(view),
    navigateToToday: () => calendarManager?.navigateToday(),
    showProduct: (variety) => calendarManager?.showProductModal(variety)
};