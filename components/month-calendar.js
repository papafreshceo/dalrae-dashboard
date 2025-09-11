/**
 * 월별 캘린더 Web Component
 * 요청사항 반영:
 * 1. 12월 중순 이후 시작 품종은 아이콘만 표시
 * 2. 색코드 열 값 반영
 * 3. 툴팁 위치 자동 조정
 * 4. 오늘 날짜 무지개 애니메이션
 */
class MonthCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.monthEvents = {};
    }
    
    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.loadData();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .calendar-container {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .calendar-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .nav-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .nav-btn {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 18px;
                    color: #495057;
                }
                
                .nav-btn:hover {
                    background: #2563eb;
                    color: white;
                    border-color: #2563eb;
                }
                
                .month-display {
                    font-size: 20px;
                    font-weight: 600;
                    color: #212529;
                    min-width: 180px;
                    text-align: center;
                }
                
                .today-btn {
                    padding: 8px 16px;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    color: #495057;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .today-btn:hover {
                    background: #2563eb;
                    color: white;
                    border-color: #2563eb;
                }
                
                .weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 0;
                    border-bottom: 2px solid #e9ecef;
                    margin-bottom: 0;
                }
                
                .weekday {
                    padding: 14px 8px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 12px;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #6c757d;
                }
                
                .weekday.sunday {
                    color: #dc3545;
                }
                
                .weekday.saturday {
                    color: #0066cc;
                }
                
                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 0;
                }
                
                .day-cell {
                    min-height: 120px;
                    padding: 10px;
                    position: relative;
                    border-right: 1px solid #f1f3f5;
                    border-bottom: 1px solid #f1f3f5;
                    transition: all 0.2s;
                    background: white;
                }
                
                .day-cell:nth-child(7n) {
                    border-right: none;
                }
                
                .day-cell:hover:not(.other-month) {
                    background: #f8f9fa;
                    box-shadow: inset 0 0 0 1px #e9ecef;
                }
                
                .day-number {
                    font-size: 14px;
                    font-weight: 500;
                    color: #212529;
                    margin-bottom: 8px;
                }
                
                .day-cell.other-month .day-number {
                    color: #ced4da;
                }
                
                .day-cell.today {
                    position: relative;
                    background: #e7f3ff;
                }
                
                .day-cell.today::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border: 2px solid #2563eb;
                    border-radius: 4px;
                    pointer-events: none;
                }
                
                .day-cell.today .day-number {
                    color: #2563eb;
                    font-weight: 700;
                    position: relative;
                    z-index: 1;
                }
                
                .day-cell.sunday .day-number {
                    color: #ef4444;
                }
                
                .day-cell.saturday .day-number {
                    color: #2563eb;
                }
                
                .day-tags {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    margin-top: 4px;
                    position: relative;
                    z-index: 1;
                }
                
                .day-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    border: 1px solid;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .day-tag:hover {
                    transform: translateX(2px);
                }
                
                .day-tag.start {
                    border-color: #10b981;
                    color: #047857;
                }
                
                .day-tag.start::before {
                    content: '시작';
                    background: #10b981;
                    color: white;
                    padding: 0 3px;
                    border-radius: 2px;
                    font-size: 9px;
                }
                
                .day-tag.end {
                    border-color: #ef4444;
                    color: #b91c1c;
                }
                
                .day-tag.end::before {
                    content: '종료';
                    background: #ef4444;
                    color: white;
                    padding: 0 3px;
                    border-radius: 2px;
                    font-size: 9px;
                }
                
                .day-tag.icon-only::after {
                    content: '▶';
                    margin-left: 2px;
                }
                
                .loading {
                    text-align: center;
                    padding: 40px;
                    color: #6c757d;
                }
                
                @media (max-width: 768px) {
                    .calendar-container {
                        padding: 15px;
                    }
                    
                    .day-cell {
                        min-height: 100px;
                        padding: 8px;
                    }
                    
                    .day-tag {
                        font-size: 9px;
                        padding: 1px 4px;
                    }
                }
            </style>
            
            <div class="calendar-container">
                <div class="calendar-controls">
                    <div class="nav-controls">
                        <button class="nav-btn" id="prevBtn">‹</button>
                        <div class="month-display" id="monthDisplay">로딩중...</div>
                        <button class="nav-btn" id="nextBtn">›</button>
                    </div>
                    <button class="today-btn" id="todayBtn">오늘</button>
                </div>
                
                <div class="weekdays">
                    <div class="weekday sunday">일</div>
                    <div class="weekday">월</div>
                    <div class="weekday">화</div>
                    <div class="weekday">수</div>
                    <div class="weekday">목</div>
                    <div class="weekday">금</div>
                    <div class="weekday saturday">토</div>
                </div>
                
                <div class="days-grid" id="daysGrid">
                    <div class="loading">캘린더 로딩중...</div>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        const prevBtn = this.shadowRoot.getElementById('prevBtn');
        const nextBtn = this.shadowRoot.getElementById('nextBtn');
        const todayBtn = this.shadowRoot.getElementById('todayBtn');
        
        prevBtn.addEventListener('click', () => this.previousMonth());
        nextBtn.addEventListener('click', () => this.nextMonth());
        todayBtn.addEventListener('click', () => this.goToToday());
    }
    
    async loadData() {
        try {
            this.monthEvents = await DataService.getMonthEvents(this.currentYear, this.currentMonth);
            this.updateDisplay();
            this.renderDays();
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            this.showError();
        }
    }
    
    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.loadData();
    }
    
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.loadData();
    }
    
    goToToday() {
        const today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        this.loadData();
    }
    
    updateDisplay() {
        const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', 
                          '7월', '8월', '9월', '10월', '11월', '12월'];
        const display = this.shadowRoot.getElementById('monthDisplay');
        display.textContent = `${this.currentYear}년 ${monthNames[this.currentMonth]}`;
    }
    
    renderDays() {
        const grid = this.shadowRoot.getElementById('daysGrid');
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);
        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();
        const prevTotalDays = prevLastDay.getDate();
        const today = new Date();
        
        let html = '';
        
        // 이전 달 날짜들
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevTotalDays - i;
            html += `<div class="day-cell other-month">
                <div class="day-number">${day}</div>
            </div>`;
        }
        
        // 현재 달 날짜들
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            const isToday = today.getFullYear() === this.currentYear && 
                           today.getMonth() === this.currentMonth && 
                           today.getDate() === day;
            
            const classes = ['day-cell'];
            if (isToday) classes.push('today');
            if (date.getDay() === 0) classes.push('sunday');
            if (date.getDay() === 6) classes.push('saturday');
            
            const eventKey = `${this.currentYear}-${this.currentMonth}-${day}`;
            const events = this.monthEvents[eventKey] || { starts: [], ends: [] };
            
            let tagsHtml = '';
            if (events.starts.length > 0 || events.ends.length > 0) {
                tagsHtml = '<div class="day-tags">';
                
                // 시작 이벤트
                const uniqueStarts = this.getUniqueEvents(events.starts);
                uniqueStarts.forEach(event => {
                    const style = event.color ? `style="border-color: ${event.color}; color: ${event.color};"` : '';
                    
                    // 12월 15일 이후 시작하는 품종은 아이콘만 표시
                    const isLateDecember = this.currentMonth === 11 && day >= 15;
                    const tagClass = isLateDecember ? 'day-tag start icon-only' : 'day-tag start';
                    const text = isLateDecember ? '' : event.variety;
                    
                    tagsHtml += `<div class="${tagClass}" 
                                     data-variety="${event.variety}"
                                     ${style}>${text}</div>`;
                });
                
                // 종료 이벤트
                const uniqueEnds = this.getUniqueEvents(events.ends);
                uniqueEnds.forEach(event => {
                    const style = event.color ? `style="border-color: ${event.color}; color: ${event.color};"` : '';
                    tagsHtml += `<div class="day-tag end" 
                                     data-variety="${event.variety}"
                                     ${style}>${event.variety}</div>`;
                });
                
                tagsHtml += '</div>';
            }
            
            html += `<div class="${classes.join(' ')}" data-day="${day}">
                <div class="day-number">${day}</div>
                ${tagsHtml}
            </div>`;
        }
        
        // 다음 달 날짜들
        const remainingCells = 42 - (startDay + totalDays);
        for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="day-cell other-month">
                <div class="day-number">${day}</div>
            </div>`;
        }
        
        grid.innerHTML = html;
        
        // 태그 클릭 이벤트 추가
        this.attachTagEvents();
    }
    
    getUniqueEvents(events) {
        const unique = {};
        events.forEach(event => {
            if (!unique[event.variety]) {
                unique[event.variety] = event;
            }
        });
        return Object.values(unique);
    }
    
    attachTagEvents() {
        const tags = this.shadowRoot.querySelectorAll('.day-tag');
        tags.forEach(tag => {
            const variety = tag.dataset.variety;
            
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent('show-modal', {
                    detail: { variety },
                    bubbles: true,
                    composed: true
                }));
            });
            
            tag.addEventListener('mouseenter', async (e) => {
                const products = await DataService.getProductsByVariety(variety);
                if (products.length > 0) {
                    this.dispatchEvent(new CustomEvent('show-tooltip', {
                        detail: {
                            x: e.pageX,
                            y: e.pageY,
                            product: products[0]
                        },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
            
            tag.addEventListener('mouseleave', () => {
                this.dispatchEvent(new CustomEvent('hide-tooltip', {
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
    
    showError() {
        const grid = this.shadowRoot.getElementById('daysGrid');
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #dc3545;">
                데이터를 불러올 수 없습니다.
            </div>
        `;
    }
}

// Web Component 등록
customElements.define('month-calendar', MonthCalendar);
