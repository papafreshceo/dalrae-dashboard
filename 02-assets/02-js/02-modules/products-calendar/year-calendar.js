/**
 * year-calendar.js
 * 연간 캘린더 렌더링 모듈
 */

export class YearCalendar {
    constructor() {
        this.container = null;
        this.options = {};
        this.currentYear = new Date().getFullYear();
        this.monthNames = [
            '1월', '2월', '3월', '4월', '5월', '6월',
            '7월', '8월', '9월', '10월', '11월', '12월'
        ];
    }
    
    /**
     * 초기화
     */
    init(options) {
        this.container = options.container;
        this.options = options;
    }
    
    /**
     * 캘린더 렌더링
     */
    render(events, dateOptions = {}) {
        if (!this.container) return;
        
        const { year = this.currentYear } = dateOptions;
        this.currentYear = year;
        
        // 연간 캘린더 HTML 생성
        const calendarHtml = this.generateYearCalendarHTML(events, year);
        this.container.innerHTML = calendarHtml;
        
        // 이벤트 리스너 연결
        this.attachEventListeners();
        
        // 현재 월 표시
        this.markCurrentMonth();
    }
    
    /**
     * 연간 캘린더 HTML 생성
     */
    generateYearCalendarHTML(events, year) {
        let html = '<div class="calendar-year">';
        
        // 모바일용 세로 스크롤
        if (window.innerWidth <= 768) {
            html += '<div class="year-grid-mobile">';
            for (let month = 0; month < 12; month++) {
                html += this.generateMonthCard(events, year, month);
            }
            html += '</div>';
        } else {
            // 데스크톱용 그리드
            html += '<div class="year-grid">';
            for (let month = 0; month < 12; month++) {
                html += this.generateMonthCard(events, year, month);
            }
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }
    
    /**
     * 월별 카드 생성
     */
    generateMonthCard(events, year, month) {
        const monthEvents = this.getEventsForMonth(events, year, month);
        const isCurrentMonth = this.isCurrentMonth(year, month);
        
        let cardClass = 'month-card';
        if (isCurrentMonth) cardClass += ' current-month';
        if (monthEvents.length > 0) cardClass += ' has-events';
        
        let html = `<div class="${cardClass}" data-month="${month}">`;
        
        // 월 헤더
        html += `
            <div class="month-header">
                <h3>${this.monthNames[month]}</h3>
                <span class="event-count">${monthEvents.length}개 상품</span>
            </div>
        `;
        
        // 미니 캘린더
        html += '<div class="month-mini-calendar">';
        html += this.generateMiniCalendar(year, month, monthEvents);
        html += '</div>';
        
        // 이벤트 리스트
        if (monthEvents.length > 0) {
            html += '<div class="month-events">';
            html += this.generateEventsList(monthEvents);
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }
    
    /**
     * 미니 캘린더 생성
     */
    generateMiniCalendar(year, month, events) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const lastDate = lastDay.getDate();
        
        let html = '<div class="mini-calendar">';
        
        // 요일 헤더
        html += '<div class="mini-weekdays">';
        const weekdayShort = ['일', '월', '화', '수', '목', '금', '토'];
        weekdayShort.forEach((day, index) => {
            const weekendClass = index === 0 ? 'sunday' : index === 6 ? 'saturday' : '';
            html += `<div class="mini-weekday ${weekendClass}">${day}</div>`;
        });
        html += '</div>';
        
        // 날짜 그리드
        html += '<div class="mini-dates">';
        
        // 빈 셀
        for (let i = 0; i < firstDayOfWeek; i++) {
            html += '<div class="mini-date empty"></div>';
        }
        
        // 날짜
        for (let date = 1; date <= lastDate; date++) {
            const currentDate = new Date(year, month, date);
            const hasEvent = this.hasEventOnDate(events, currentDate);
            const isToday = this.isToday(currentDate);
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            
            let dateClass = 'mini-date';
            if (hasEvent) dateClass += ' has-event';
            if (isToday) dateClass += ' today';
            if (isWeekend) dateClass += ' weekend';
            
            html += `<div class="${dateClass}">${date}</div>`;
        }
        
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    /**
     * 이벤트 리스트 생성
     */
    generateEventsList(events) {
        // 중복 제거 (품종별로 그룹화)
        const uniqueEvents = this.getUniqueEvents(events);
        
        let html = '<div class="events-list">';
        
        uniqueEvents.slice(0, 5).forEach(event => {
            const statusClass = this.getStatusClass(event.status);
            html += `
                <div class="event-item ${statusClass}" data-event-id="${event.id}">
                    <span class="event-name">${event.variety || event.title}</span>
                    ${event.status ? `<span class="event-status">${event.status}</span>` : ''}
                </div>
            `;
        });
        
        if (uniqueEvents.length > 5) {
            html += `<div class="more-events-link">+${uniqueEvents.length - 5}개 더보기</div>`;
        }
        
        html += '</div>';
        return html;
    }
    
    /**
     * 월별 이벤트 가져오기
     */
    getEventsForMonth(events, year, month) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        return events.filter(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            
            // 월과 겹치는 이벤트
            return !(eventEnd < startDate || eventStart > endDate);
        });
    }
    
    /**
     * 날짜에 이벤트 있는지 확인
     */
    hasEventOnDate(events, date) {
        return events.some(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            
            eventStart.setHours(0, 0, 0, 0);
            eventEnd.setHours(23, 59, 59, 999);
            date.setHours(12, 0, 0, 0);
            
            return date >= eventStart && date <= eventEnd;
        });
    }
    
    /**
     * 중복 이벤트 제거
     */
    getUniqueEvents(events) {
        const unique = {};
        
        events.forEach(event => {
            const key = event.variety || event.title;
            if (!unique[key] || this.getStatusPriority(event.status) > this.getStatusPriority(unique[key].status)) {
                unique[key] = event;
            }
        });
        
        return Object.values(unique);
    }
    
    /**
     * 상태 우선순위
     */
    getStatusPriority(status) {
        const priority = {
            '공급중': 5,
            '출하준비중': 4,
            '잠시만요': 3,
            '시즌종료': 2,
            '공급중지': 1
        };
        return priority[status] || 0;
    }
    
    /**
     * 현재 월 확인
     */
    isCurrentMonth(year, month) {
        const today = new Date();
        return year === today.getFullYear() && month === today.getMonth();
    }
    
    /**
     * 오늘 날짜 확인
     */
    isToday(date) {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
    }
    
    /**
     * 현재 월 표시
     */
    markCurrentMonth() {
        const currentMonthCard = this.container.querySelector('.month-card.current-month');
        if (currentMonthCard && window.innerWidth <= 768) {
            // 모바일에서 현재 월로 스크롤
            setTimeout(() => {
                currentMonthCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
    
    /**
     * 오늘로 스크롤
     */
    scrollToToday() {
        const currentMonthCard = this.container.querySelector('.month-card.current-month');
        if (currentMonthCard) {
            currentMonthCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 강조 효과
            currentMonthCard.classList.add('highlight');
            setTimeout(() => {
                currentMonthCard.classList.remove('highlight');
            }, 2000);
        }
    }
    
    /**
     * 이벤트 리스너 연결
     */
    attachEventListeners() {
        // 월 카드 클릭
        this.container.querySelectorAll('.month-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // 이벤트 아이템 클릭
                if (e.target.closest('.event-item')) {
                    const eventItem = e.target.closest('.event-item');
                    const eventId = eventItem.dataset.eventId;
                    this.handleEventClick(eventId);
                    return;
                }
                
                // 더보기 링크 클릭
                if (e.target.classList.contains('more-events-link')) {
                    const month = parseInt(card.dataset.month);
                    this.handleMonthClick(month);
                    return;
                }
                
                // 월 카드 클릭
                const month = parseInt(card.dataset.month);
                this.handleMonthClick(month);
            });
        });
        
        // 이벤트 아이템 호버
        this.container.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.showEventTooltip(e);
            });
            
            item.addEventListener('mouseleave', () => {
                this.hideEventTooltip();
            });
        });
    }
    
    /**
     * 이벤트 클릭 처리
     */
    handleEventClick(eventId) {
        if (this.options.onEventClick) {
            this.options.onEventClick({ id: eventId });
        }
    }
    
    /**
     * 월 클릭 처리
     */
    handleMonthClick(month) {
        if (this.options.onMonthClick) {
            this.options.onMonthClick(month);
        }
    }
    
    /**
     * 이벤트 툴팁 표시
     */
    showEventTooltip(e) {
        const eventItem = e.currentTarget;
        const eventName = eventItem.querySelector('.event-name').textContent;
        const eventStatus = eventItem.querySelector('.event-status')?.textContent;
        
        if (window.TooltipManager) {
            window.TooltipManager.show({
                x: e.pageX,
                y: e.pageY,
                content: `${eventName}${eventStatus ? ` - ${eventStatus}` : ''}`
            });
        }
    }
    
    /**
     * 이벤트 툴팁 숨기기
     */
    hideEventTooltip() {
        if (window.TooltipManager) {
            window.TooltipManager.hide();
        }
    }
    
    /**
     * 상태별 클래스
     */
    getStatusClass(status) {
        const statusMap = {
            '공급중': 'status-active',
            '출하준비중': 'status-preparing',
            '잠시만요': 'status-warning',
            '시즌종료': 'status-paused',
            '공급중지': 'status-stopped'
        };
        return statusMap[status] || 'status-default';
    }
}