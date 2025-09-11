// delivery-calendar.js - 통합 버전 (모든 컴포넌트 포함)

// ============= Holiday API Service =============
class DeliveryHolidayAPI {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24시간
    }

    async fetchHolidays(year) {
        const cacheKey = `holidays-${year}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }

        try {
            const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/KR`);
            const data = await response.json();
            
            const holidays = {};
            data.forEach(holiday => {
                holidays[holiday.date] = {
                    name: holiday.localName || holiday.name,
                    type: holiday.types?.includes('Authorities') ? '임시공휴일' : '공휴일'
                };
            });

            this.cache.set(cacheKey, {
                data: holidays,
                timestamp: Date.now()
            });

            return holidays;
        } catch (error) {
            console.error(`${year}년 공휴일 로드 실패:`, error);
            return {};
        }
    }

    async fetchMultiYearHolidays(startYear, endYear) {
        const allHolidays = {};
        
        for (let year = startYear; year <= endYear; year++) {
            const yearHolidays = await this.fetchHolidays(year);
            Object.assign(allHolidays, yearHolidays);
        }
        
        return allHolidays;
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    clearCache() {
        this.cache.clear();
    }
}

const holidayAPI = new DeliveryHolidayAPI();

// ============= Delivery Data Service =============
class DeliveryDataService {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = null;
        this.cacheExpiry = 10 * 60 * 1000; // 10분
    }

    async fetchSheetData() {
        try {
            const response = await fetch('/api/delivery');
            const data = await response.json();
            
            const expandedData = data.map(row => {
                if (!row) return Array(9).fill('');
                const newRow = [...row];
                while (newRow.length < 9) {
                    newRow.push('');
                }
                return newRow;
            });
            
            return expandedData;
        } catch (error) {
            console.error('시트 데이터 로드 실패:', error);
            // 테스트용 더미 데이터 반환
            return this.getDummyData();
        }
    }

    getDummyData() {
        // 테스트용 더미 데이터
        const today = new Date();
        const dummyData = [
            ['날짜', '요일', '공휴일', '임시공휴일', '기타', '배송YN', '이슈', '공지제목', '공지내용']
        ];
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
            const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
            const dayName = days[date.getDay()];
            
            dummyData.push([
                dateStr,
                dayName,
                '', // 공휴일
                '', // 임시공휴일
                '', // 기타
                date.getDay() === 0 || date.getDay() === 6 ? 'N' : 'Y', // 배송YN
                '', // 이슈
                i === 1 ? '배송 안내' : '', // 공지제목
                i === 1 ? '평일 오전 10시 이전 주문 시 당일 발송됩니다.' : '' // 공지내용
            ]);
        }
        
        return dummyData;
    }

    async processDeliveryData() {
        if (this.cache && this.cacheTimestamp && 
            Date.now() - this.cacheTimestamp < this.cacheExpiry) {
            return this.cache;
        }

        const sheetData = await this.fetchSheetData();
        const currentYear = new Date().getFullYear();
        const holidays = await holidayAPI.fetchMultiYearHolidays(currentYear, currentYear + 1);
        
        const deliveryMap = {};
        
        sheetData.forEach((row, index) => {
            if (index === 0) return;
            
            const [date, dayName, sheetHoliday, sheetTempHoliday, other, deliveryYN, issue, noticeHeader, noticeContent] = row;
            
            if (!date) return;
            
            const dateObj = new Date(date.replace(/\. /g, '-'));
            const formattedDate = this.formatDate(dateObj);
            
            const apiHoliday = holidays[formattedDate];
            
            deliveryMap[formattedDate] = {
                date: formattedDate,
                dayName: dayName || this.getDayNameFromDate(formattedDate),
                holiday: sheetHoliday || (apiHoliday?.type === '공휴일' ? apiHoliday.name : ''),
                tempHoliday: sheetTempHoliday || (apiHoliday?.type === '임시공휴일' ? apiHoliday.name : ''),
                other: other || '',
                issue: issue || '',
                sheetDeliveryYN: deliveryYN,
                dayOfWeek: dateObj.getDay(),
                noticeHeader: noticeHeader || '',
                noticeContent: noticeContent || ''
            };
        });
        
        Object.keys(deliveryMap).forEach(dateStr => {
            const info = deliveryMap[dateStr];
            const dayOfWeek = info.dayOfWeek;
            const sheetValue = info.sheetDeliveryYN?.toString().toUpperCase();
            
            let canDeliver = false;
            let deliveryType = 'none';
            
            if (dayOfWeek === 6) {
                canDeliver = false;
                deliveryType = 'none';
            } else if (this.isBeforeHoliday(dateStr, deliveryMap)) {
                canDeliver = false;
                deliveryType = 'none';
            } else if (dayOfWeek === 0) {
                canDeliver = true;
                deliveryType = 'special';
            } else if (this.isLastDayOfHolidayPeriod(dateStr, deliveryMap)) {
                canDeliver = true;
                deliveryType = 'special';
            } else if (sheetValue === 'N') {
                canDeliver = false;
                deliveryType = 'none';
            } else if (info.holiday || info.tempHoliday) {
                canDeliver = false;
                deliveryType = 'none';
            } else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                canDeliver = true;
                deliveryType = 'normal';
            }
            
            deliveryMap[dateStr].canDeliver = canDeliver;
            deliveryMap[dateStr].deliveryType = deliveryType;
        });
        
        this.cache = deliveryMap;
        this.cacheTimestamp = Date.now();
        
        return deliveryMap;
    }

    isLastDayOfHolidayPeriod(dateStr, deliveryMap) {
        const date = new Date(dateStr);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDateStr = this.formatDate(nextDay);
        
        const currentInfo = deliveryMap[dateStr];
        const nextInfo = deliveryMap[nextDateStr];
        
        if (currentInfo && (currentInfo.holiday || currentInfo.tempHoliday || currentInfo.dayOfWeek === 0)) {
            if (nextInfo && nextInfo.dayOfWeek >= 1 && nextInfo.dayOfWeek <= 5 && 
                !nextInfo.holiday && !nextInfo.tempHoliday) {
                return true;
            }
        }
        
        return false;
    }

    isBeforeHoliday(dateStr, deliveryMap) {
        const date = new Date(dateStr);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDateStr = this.formatDate(nextDay);
        
        const nextInfo = deliveryMap[nextDateStr];
        
        if (nextInfo && (nextInfo.holiday || nextInfo.tempHoliday || nextInfo.dayOfWeek === 0)) {
            return true;
        }
        
        return false;
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    getDayNameFromDate(dateStr) {
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const date = new Date(dateStr);
        return days[date.getDay()];
    }

    async getNotices() {
        const sheetData = await this.fetchSheetData();
        const notices = [];
        
        sheetData.forEach((row, index) => {
            if (index === 0) return;
            
            const noticeHeader = row[7];
            const noticeContent = row[8];
            
            if (noticeHeader && noticeContent && 
                noticeHeader.trim() !== '' && noticeContent.trim() !== '') {
                notices.push({
                    header: noticeHeader,
                    content: noticeContent
                });
            }
        });
        
        return notices;
    }

    async getMonthData(year, month) {
        const allData = await this.processDeliveryData();
        const monthData = {};
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
            const dateStr = this.formatDate(d);
            if (allData[dateStr]) {
                monthData[dateStr] = allData[dateStr];
            }
        }
        
        return monthData;
    }

    clearCache() {
        this.cache = null;
        this.cacheTimestamp = null;
    }
}

const deliveryDataService = new DeliveryDataService();

// ============= Calendar Navigation Component =============
class DeliveryCalendarNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .nav-controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    border-bottom: 1px solid #dee2e6;
                    background: #f8f9fa;
                }
                
                .nav-button {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 18px;
                    color: #495057;
                }
                
                .nav-button:hover {
                    border-color: #2563eb;
                    color: #2563eb;
                    background: #f8f9fa;
                }
                
                .nav-button:active {
                    transform: scale(0.95);
                }
                
                .today-button {
                    padding: 10px 24px;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    color: #495057;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .today-button:hover {
                    border-color: #2563eb;
                    color: #2563eb;
                    background: #f8f9fa;
                }
                
                .today-button:active {
                    transform: scale(0.98);
                }
                
                .month-display {
                    font-size: 20px;
                    font-weight: 600;
                    min-width: 150px;
                    text-align: center;
                    color: #212529;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                @media (max-width: 768px) {
                    .nav-controls {
                        gap: 12px;
                        padding: 16px;
                    }
                    
                    .nav-button {
                        width: 36px;
                        height: 36px;
                        font-size: 16px;
                    }
                    
                    .month-display {
                        font-size: 18px;
                        min-width: 120px;
                    }
                    
                    .today-button {
                        padding: 8px 16px;
                        font-size: 13px;
                    }
                }
            </style>
            
            <div class="nav-controls">
                <button class="nav-button" id="prevMonth">‹</button>
                <div class="month-display">
                    ${this.currentYear}년 ${this.currentMonth + 1}월
                </div>
                <button class="nav-button" id="nextMonth">›</button>
                <button class="today-button" id="todayBtn">오늘</button>
            </div>
        `;
    }

    attachEventListeners() {
        this.shadowRoot.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        this.shadowRoot.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        this.shadowRoot.getElementById('todayBtn').addEventListener('click', () => {
            this.goToToday();
        });
    }

    changeMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }

        this.updateDisplay();
        this.dispatchEvent(new CustomEvent('monthChanged', {
            detail: {
                year: this.currentYear,
                month: this.currentMonth
            }
        }));
    }

    goToToday() {
        const today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        
        this.updateDisplay();
        this.dispatchEvent(new CustomEvent('monthChanged', {
            detail: {
                year: this.currentYear,
                month: this.currentMonth
            }
        }));
    }

    updateDisplay() {
        const display = this.shadowRoot.querySelector('.month-display');
        if (display) {
            display.textContent = `${this.currentYear}년 ${this.currentMonth + 1}월`;
        }
    }

    setMonth(year, month) {
        this.currentYear = year;
        this.currentMonth = month;
        this.updateDisplay();
    }
}

// ============= Calendar Grid Component =============
class DeliveryCalendarGrid extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.deliveryData = {};
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .month-view {
                    padding: 0;
                }
                
                .weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    background: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .weekday {
                    padding: 16px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 12px;
                    color: #495057;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .weekday.sunday {
                    color: #dc3545;
                }
                
                .weekday.saturday {
                    color: #2563eb;
                }
                
                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                }
                
                .day-cell {
                    background: white;
                    min-height: 120px;
                    padding: 12px;
                    position: relative;
                    border-right: 1px solid #f1f3f5;
                    border-bottom: 1px solid #f1f3f5;
                    transition: all 0.2s;
                }
                
                .day-cell:nth-child(7n) {
                    border-right: none;
                }
                
                .day-cell:hover {
                    background: #f8f9fa;
                    z-index: 10;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .day-cell.other-month {
                    background: #fafafa;
                }
                
                .day-cell.today {
                    background: #e7f3ff;
                }
                
                .day-number {
                    font-size: 14px;
                    font-weight: 500;
                    color: #212529;
                    margin-bottom: 8px;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .day-cell.today .day-number {
                    color: #2563eb;
                    font-weight: 700;
                }
                
                .day-number.sunday,
                .day-number.holiday {
                    color: #dc3545;
                }
                
                .day-number.saturday {
                    color: #2563eb;
                }
                
                .delivery-icon {
                    position: absolute;
                    bottom: 12px;
                    right: 12px;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                
                .delivery-icon svg {
                    width: 16px;
                    height: 16px;
                    transition: transform 0.2s;
                }
                
                .delivery-icon.special {
                    background: rgba(37, 99, 235, 0.1);
                }
                
                .delivery-icon.special svg {
                    stroke: #2563eb;
                }
                
                .delivery-icon.available {
                    background: rgba(16, 185, 129, 0.1);
                }
                
                .delivery-icon.available svg {
                    stroke: #10b981;
                }
                
                .delivery-icon.unavailable {
                    background: rgba(239, 68, 68, 0.1);
                }
                
                .delivery-icon.unavailable svg {
                    stroke: #ef4444;
                }
                
                .day-cell:hover .delivery-icon {
                    transform: scale(1.1);
                }
                
                .day-cell:hover .delivery-icon svg {
                    transform: rotate(5deg);
                }
                
                .day-badges {
                    position: absolute;
                    top: 32px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 90%;
                    gap: 4px;
                }
                
                .badge {
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 500;
                    width: 100%;
                    text-align: center;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .badge.issue {
                    background: #fee2e2;
                    color: #dc3545;
                    border: 1px solid #fecaca;
                }
                
                .badge.other {
                    background: #ede9fe;
                    color: #2563eb;
                    border: 1px solid #ddd6fe;
                }
                
                .badge.holiday {
                    background: #fef3c7;
                    color: #f59e0b;
                    border: 1px solid #fde68a;
                }
                
                .badge.temp-holiday {
                    background: #dbeafe;
                    color: #2563eb;
                    border: 1px solid #bfdbfe;
                }
                
                .loading {
                    text-align: center;
                    padding: 40px;
                    color: #6c757d;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                @media (max-width: 768px) {
                    .weekday {
                        padding: 12px 8px;
                        font-size: 11px;
                    }
                    
                    .day-cell {
                        min-height: 80px;
                        padding: 8px;
                    }
                    
                    .day-number {
                        font-size: 12px;
                    }
                    
                    .delivery-icon {
                        width: 24px;
                        height: 24px;
                        bottom: 8px;
                        right: 8px;
                    }
                    
                    .delivery-icon svg {
                        width: 14px;
                        height: 14px;
                    }
                    
                    .badge {
                        font-size: 9px;
                        padding: 1px 4px;
                    }
                }
            </style>
            
            <div class="month-view">
                <div class="loading">캘린더 로딩 중...</div>
            </div>
        `;
    }

    getDeliveryIcon(type) {
        const icons = {
            special: `
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                </svg>
            `,
            available: `
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `,
            unavailable: `
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `
        };
        return icons[type] || icons.unavailable;
    }

    updateCalendar(year, month, deliveryData) {
        this.currentYear = year;
        this.currentMonth = month;
        this.deliveryData = deliveryData;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();
        const currentDate = new Date();
        
        let html = `
            <div class="weekdays">
                <div class="weekday sunday">일</div>
                <div class="weekday">월</div>
                <div class="weekday">화</div>
                <div class="weekday">수</div>
                <div class="weekday">목</div>
                <div class="weekday">금</div>
                <div class="weekday saturday">토</div>
            </div>
            <div class="days-grid">
        `;
        
        for (let i = 0; i < startDay; i++) {
            html += `<div class="day-cell other-month"></div>`;
        }
        
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const deliveryInfo = deliveryData[dateStr] || {};
            
            const isToday = currentDate.getFullYear() === year && 
                           currentDate.getMonth() === month && 
                           currentDate.getDate() === day;
            const isSunday = deliveryInfo.dayOfWeek === 0;
            const isSaturday = deliveryInfo.dayOfWeek === 6;
            const isHoliday = deliveryInfo.holiday || deliveryInfo.tempHoliday;
            
            let dayNumberClass = '';
            if (isSunday || isHoliday) {
                dayNumberClass = 'holiday';
            } else if (isSaturday) {
                dayNumberClass = 'saturday';
            }
            
            let badges = [];
            let deliveryIcon = '';

            if (deliveryInfo.deliveryType === 'special') {
                deliveryIcon = `<div class="delivery-icon special">${this.getDeliveryIcon('special')}</div>`;
            } else if (deliveryInfo.deliveryType === 'normal') {
                deliveryIcon = `<div class="delivery-icon available">${this.getDeliveryIcon('available')}</div>`;
            } else {
                deliveryIcon = `<div class="delivery-icon unavailable">${this.getDeliveryIcon('unavailable')}</div>`;
            }

            if (deliveryInfo.issue) {
                badges.push(`<div class="badge issue">${deliveryInfo.issue}</div>`);
            }
            if (deliveryInfo.other) {
                badges.push(`<div class="badge other">${deliveryInfo.other}</div>`);
            }
            if (deliveryInfo.holiday) {
                badges.push(`<div class="badge holiday">${deliveryInfo.holiday}</div>`);
            }
            if (deliveryInfo.tempHoliday) {
                badges.push(`<div class="badge temp-holiday">${deliveryInfo.tempHoliday}</div>`);
            }
            
            html += `
                <div class="day-cell ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <div class="day-number ${dayNumberClass}">
                        ${day}
                    </div>
                    ${deliveryIcon}
                    ${badges.length > 0 ? `<div class="day-badges">${badges.join('')}</div>` : ''}
                </div>
            `;
        }
        
        const remainingCells = 42 - (startDay + totalDays);
        for (let i = 0; i < remainingCells; i++) {
            html += `<div class="day-cell other-month"></div>`;
        }
        
        html += `
            </div>
        `;
        
        const monthView = this.shadowRoot.querySelector('.month-view');
        if (monthView) {
            monthView.innerHTML = html;
        }
    }

    showLoading() {
        const monthView = this.shadowRoot.querySelector('.month-view');
        if (monthView) {
            monthView.innerHTML = '<div class="loading">캘린더 로딩 중...</div>';
        }
    }

    showError(message) {
        const monthView = this.shadowRoot.querySelector('.month-view');
        if (monthView) {
            monthView.innerHTML = `<div class="loading">${message}</div>`;
        }
    }
}

// ============= Notices Component =============
class DeliveryNotices extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.notices = [];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .notice-section {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 24px;
                    margin-bottom: 30px;
                }
                
                .notice-header-main {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .notice-header-main h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #212529;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .notices-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .notice-card {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    transition: all 0.2s;
                    overflow: hidden;
                }
                
                .notice-card:hover {
                    border-color: #2563eb;
                }
                
                .notice-header {
                    padding: 14px 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    background: transparent;
                    user-select: none;
                }
                
                .notice-header h4 {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 500;
                    color: #212529;
                    line-height: 1.4;
                    flex: 1;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .toggle-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    color: #6c757d;
                    font-size: 14px;
                    transition: transform 0.2s;
                    margin-left: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .toggle-btn.open {
                    transform: rotate(180deg);
                }
                
                .notice-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                    background: #f8f9fa;
                    border-top: 1px solid #dee2e6;
                }
                
                .notice-content.open {
                    max-height: 500px;
                }
                
                .notice-content-inner {
                    padding: 14px 18px;
                }
                
                .notice-content p {
                    margin: 0;
                    font-size: 13px;
                    line-height: 1.6;
                    color: #495057;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                    white-space: pre-wrap;
                }
                
                .no-notices {
                    text-align: center;
                    color: #6c757d;
                    font-size: 14px;
                    padding: 20px;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                @media (max-width: 768px) {
                    .notice-section {
                        padding: 20px 16px;
                        margin-bottom: 20px;
                    }
                    
                    .notice-header-main h3 {
                        font-size: 16px;
                    }
                    
                    .notice-header {
                        padding: 12px 14px;
                    }
                    
                    .notice-header h4 {
                        font-size: 13px;
                    }
                    
                    .notice-content-inner {
                        padding: 12px 14px;
                    }
                    
                    .notice-content p {
                        font-size: 12px;
                    }
                }
            </style>
            
            <div class="notice-section">
                <div class="notice-header-main">
                    <h3>공지사항</h3>
                </div>
                <div class="notices-list">
                    <div class="no-notices">공지사항을 불러오는 중...</div>
                </div>
            </div>
        `;
    }

    updateNotices(notices) {
        this.notices = notices;
        const noticesList = this.shadowRoot.querySelector('.notices-list');
        
        if (!noticesList) return;
        
        if (!notices || notices.length === 0) {
            noticesList.innerHTML = `
                <div class="notice-card">
                    <div class="notice-header" data-index="0">
                        <h4>배송 일정 안내</h4>
                        <button class="toggle-btn">▼</button>
                    </div>
                    <div class="notice-content" data-index="0">
                        <div class="notice-content-inner">
                            <p>평일 오전 10시 이전 주문 시 당일 발송됩니다.
주말 및 공휴일은 발송이 없습니다.</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            noticesList.innerHTML = notices.map((notice, index) => `
                <div class="notice-card">
                    <div class="notice-header" data-index="${index}">
                        <h4>${this.escapeHtml(notice.header)}</h4>
                        <button class="toggle-btn">▼</button>
                    </div>
                    <div class="notice-content" data-index="${index}">
                        <div class="notice-content-inner">
                            <p>${this.escapeHtml(notice.content)}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        this.attachNoticeListeners();
    }

    attachNoticeListeners() {
        const headers = this.shadowRoot.querySelectorAll('.notice-header');
        
        headers.forEach(header => {
            header.addEventListener('click', (e) => {
                const index = header.dataset.index;
                this.toggleNotice(index);
            });
        });
    }

    toggleNotice(index) {
        const content = this.shadowRoot.querySelector(`.notice-content[data-index="${index}"]`);
        const button = this.shadowRoot.querySelector(`.notice-header[data-index="${index}"] .toggle-btn`);
        
        if (!content || !button) return;
        
        const isOpen = content.classList.contains('open');
        
        const allContents = this.shadowRoot.querySelectorAll('.notice-content');
        const allButtons = this.shadowRoot.querySelectorAll('.toggle-btn');
        
        allContents.forEach(el => el.classList.remove('open'));
        allButtons.forEach(btn => btn.classList.remove('open'));
        
        if (!isOpen) {
            content.classList.add('open');
            button.classList.add('open');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const noticesList = this.shadowRoot.querySelector('.notices-list');
        if (noticesList) {
            noticesList.innerHTML = `<div class="no-notices">${message}</div>`;
        }
    }
}

// ============= Legend Component =============
class DeliveryLegend extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .delivery-info {
                    padding: 24px;
                    background: #f8f9fa;
                    border-top: 1px solid #dee2e6;
                }
                
                .delivery-info h3 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #212529;
                    margin: 0 0 16px 0;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #dee2e6;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .delivery-info ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .delivery-info li {
                    padding: 6px 0;
                    color: #495057;
                    font-size: 13px;
                    line-height: 1.5;
                    display: flex;
                    align-items: center;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .delivery-info li.section-title {
                    font-weight: 600;
                    color: #212529;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid #dee2e6;
                }
                
                .delivery-info li.section-title:first-child {
                    margin-top: 0;
                    padding-top: 0;
                    border-top: none;
                }
                
                .icon-indicator {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    margin-right: 10px;
                    flex-shrink: 0;
                }
                
                .icon-indicator svg {
                    width: 14px;
                    height: 14px;
                }
                
                .icon-indicator.special {
                    background: rgba(37, 99, 235, 0.1);
                }
                
                .icon-indicator.special svg {
                    stroke: #2563eb;
                }
                
                .icon-indicator.available {
                    background: rgba(16, 185, 129, 0.1);
                }
                
                .icon-indicator.available svg {
                    stroke: #10b981;
                }
                
                .icon-indicator.unavailable {
                    background: rgba(239, 68, 68, 0.1);
                }
                
                .icon-indicator.unavailable svg {
                    stroke: #ef4444;
                }
                
                .bullet-item {
                    padding-left: 12px;
                }
                
                @media (max-width: 768px) {
                    .delivery-info {
                        padding: 20px 16px;
                    }
                    
                    .delivery-info h3 {
                        font-size: 15px;
                    }
                    
                    .delivery-info li {
                        font-size: 12px;
                        padding: 5px 0;
                    }
                    
                    .icon-indicator {
                        width: 22px;
                        height: 22px;
                    }
                    
                    .icon-indicator svg {
                        width: 12px;
                        height: 12px;
                    }
                }
            </style>
            
            <div class="delivery-info">
                <h3>발송 안내</h3>
                <ul>
                    <li class="section-title">발송 정책</li>
                    <li class="bullet-item">• 영업일: 발송</li>
                    <li class="bullet-item">• 토요일: 발송 없음</li>
                    <li class="bullet-item">• 일요일/연휴 마지막날: 상품/산지여건에 따라 발송</li>
                    <li class="bullet-item">• 공휴일 전날: 발송 휴무</li>
                    
                    <li class="section-title">아이콘 안내</li>
                    <li>
                        <span class="icon-indicator special">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                            </svg>
                        </span>
                        파란색: 상품/산지여건에 따라 발송
                    </li>
                    <li>
                        <span class="icon-indicator available">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </span>
                        초록색: 발송
                    </li>
                    <li>
                        <span class="icon-indicator unavailable">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </span>
                        빨간색: 발송 휴무
                    </li>
                </ul>
            </div>
        `;
    }
}

// ============= Main Calendar Component =============
class DeliveryCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.deliveryData = {};
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.loadData();
    }

    render() {
        const showNotices = this.getAttribute('show-notices') !== 'false';
        const showLegend = this.getAttribute('show-legend') !== 'false';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                * {
                    box-sizing: border-box;
                }
                
                .hero {
                    min-height: calc(100vh - 200px);
                    padding: 40px 20px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                }
                
                .card {
                    max-width: 1400px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                
                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 30px;
                }
                
                .title-group {
                    flex: 1;
                }
                
                .eyebrow {
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: .06em;
                    color: #6c757d;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                }
                
                .title {
                    font-size: 36px;
                    line-height: 1.25;
                    font-weight: 800;
                    color: #212529;
                    margin: 0 0 16px 0;
                }
                
                .title strong {
                    color: #2563eb;
                }
                
                .subtitle {
                    font-size: 16px;
                    color: #495057;
                    line-height: 1.6;
                    margin: 0;
                }
                
                .divider {
                    width: 100%;
                    height: 1px;
                    background: #dee2e6;
                    margin: 0 0 40px 0;
                }
                
                .calendar-wrapper {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .error-message {
                    text-align: center;
                    padding: 40px;
                    color: #dc3545;
                }
                
                @media (max-width: 768px) {
                    .hero {
                        padding: 20px 15px;
                    }
                    
                    .card {
                        padding: 25px 20px;
                        border-radius: 12px;
                    }
                    
                    .title {
                        font-size: 28px;
                    }
                    
                    .subtitle {
                        font-size: 14px;
                    }
                }
            </style>
            
            <div class="hero">
                <section class="card">
                    <div class="header-section">
                        <div class="title-group">
                            <div class="eyebrow">Delivery Schedule</div>
                            <h1 class="title">배송 <strong>캘린더</strong></h1>
                            <p class="subtitle">
                                발송 가능일과 휴무일을 확인하실 수 있습니다.<br>
                                정확한 배송 일정은 상품 상세 페이지를 참고해주세요.
                            </p>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    ${showNotices ? '<delivery-notices></delivery-notices>' : ''}
                    
                    <div class="calendar-wrapper">
                        <delivery-calendar-nav></delivery-calendar-nav>
                        <delivery-calendar-grid></delivery-calendar-grid>
                        ${showLegend ? '<delivery-legend></delivery-legend>' : ''}
                    </div>
                </section>
            </div>
        `;
    }

    attachEventListeners() {
        const nav = this.shadowRoot.querySelector('delivery-calendar-nav');
        if (nav) {
            nav.addEventListener('monthChanged', (e) => {
                this.currentYear = e.detail.year;
                this.currentMonth = e.detail.month;
                this.updateCalendar();
            });
        }
    }

    async loadData() {
        try {
            this.deliveryData = await deliveryDataService.processDeliveryData();
            
            const notices = await deliveryDataService.getNotices();
            const noticesComponent = this.shadowRoot.querySelector('delivery-notices');
            if (noticesComponent) {
                noticesComponent.updateNotices(notices);
            }
            
            this.updateCalendar();
            
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            this.showError('배송 캘린더 데이터를 불러올 수 없습니다.');
        }
    }

    async updateCalendar() {
        const grid = this.shadowRoot.querySelector('delivery-calendar-grid');
        if (!grid) return;
        
        try {
            grid.showLoading();
            
            const monthData = await deliveryDataService.getMonthData(
                this.currentYear, 
                this.currentMonth
            );
            
            grid.updateCalendar(
                this.currentYear,
                this.currentMonth,
                monthData
            );
            
        } catch (error) {
            console.error('캘린더 업데이트 실패:', error);
            grid.showError('캘린더를 표시할 수 없습니다.');
        }
    }

    showError(message) {
        const wrapper = this.shadowRoot.querySelector('.calendar-wrapper');
        if (wrapper) {
            wrapper.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }

    refresh() {
        this.loadData();
    }

    goToMonth(year, month) {
        this.currentYear = year;
        this.currentMonth = month;
        
        const nav = this.shadowRoot.querySelector('delivery-calendar-nav');
        if (nav) {
            nav.setMonth(year, month);
        }
        
        this.updateCalendar();
    }

    goToToday() {
        const today = new Date();
        this.goToMonth(today.getFullYear(), today.getMonth());
    }
}

// ============= Register All Components =============
customElements.define('delivery-calendar-nav', DeliveryCalendarNav);
customElements.define('delivery-calendar-grid', DeliveryCalendarGrid);
customElements.define('delivery-notices', DeliveryNotices);
customElements.define('delivery-legend', DeliveryLegend);
customElements.define('delivery-calendar', DeliveryCalendar);

// 전역 객체로 내보내기
window.DeliveryCalendar = DeliveryCalendar;
