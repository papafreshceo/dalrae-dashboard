/**
 * month-calendar.js
 * 월별 캘린더 렌더링 모듈
 */

export class MonthCalendar {
    constructor() {
        this.container = null;
        this.options = {};
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
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
        
        const { month = this.currentMonth, year = this.currentYear } = dateOptions;
        
        this.currentMonth = month;
        this.currentYear = year;
        
        // 캘린더 HTML 생성
        const calendarHtml = this.generateCalendarHTML(events, month, year);
        this.container.innerHTML = calendarHtml;
        
        // 이벤트 리스너 연결
        this.attachEventListeners();
        
        // 오늘 날짜 표시
        this.markToday();
    }
    
    /**
     * 캘린더 HTML 생성
     */
    generateCalendarHTML(events, month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        
        const firstDayOfWeek = firstDay.getDay();
        const lastDate = lastDay.getDate();
        const prevLastDate = prevLastDay.getDate();
        
        let html = '<div class="calendar-month">';
        
        // 요일 헤더
        html += this.generateWeekdayHeader();
        
        // 날짜 그리드
        html += '<div class="calendar-grid">';
        
        // 이전 달 날짜
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = prevLastDate - i;
            html += `<div class="calendar-cell other-month">${date}</div>`;
        }
        
        // 현재 달 날짜
        for (let date = 1; date <= lastDate; date++) {
            const currentDate = new Date(year, month, date);
            const dayEvents = this.getEventsForDate(events, currentDate);
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            const isToday = this.isToday(currentDate);
            
            html += this.generateDateCell(date, dayEvents, isWeekend, isToday);
        }
        
        // 다음 달 날짜
        const totalCells = firstDayOfWeek + lastDate;
        const nextMonthDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        
        for (let date = 1; date <= nextMonthDays; date++) {
            html += `<div class="calendar-cell other-month">${date}</div>`;
        }
        
        html += '</div>'; // calendar-grid
        html += '</div>'; // calendar-month
        
        return html;
    }
    
    /**
     * 요일 헤더 생성
     */
    generateWeekdayHeader() {
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        let html = '<div class="calendar-weekdays">';
        
        weekdays.forEach((day, index) => {
            const isWeekend = index === 0 || index === 6;
            const weekendClass = isWeekend ? (index === 0 ? 'sunday' : 'saturday') : '';
            html += `<div class="weekday ${weekendClass}">${day}</div>`;
        });
        
        html += '</div>';
        return html;
    }
    
    /**
     * 날짜 셀 생성
     */
    generateDateCell(date, events, isWeekend, isToday) {
        let cellClass = 'calendar-cell';
        if (isWeekend) cellClass += ' weekend';
        if (isToday) cellClass += ' today';
        if (events.length > 0) cellClass += ' has-events';
        
        let html = `<div class="${cellClass}" data-date="${date}">`;
        html += `<div class="cell-date">${date}</div>`;
        
        if (events.length > 0) {
            html += '<div class="cell-events">';
            
            // 최대 3개까지만 표시
            const displayEvents = events.slice(0, 3);
            displayEvents.forEach(event => {
                const statusClass = this.getStatusClass(event.status);
                html += `
                    <div class="event-tag ${statusClass}" 
                         data-event-id="${event.id}"
                         title="${event.title}">
                        <span class="event-title">${event.variety || event.title}</span>
                    </div>
                `;
            });
            
            // 더 많은 이벤트가 있으면 표시
            if (events.length > 3) {
                html += `<div class="more-events">+${events.length - 3}</div>`;
            }
            
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }
    
    /**
     * 날짜별 이벤트 가져오기
     */
    getEventsForDate(events, date) {
        return events.filter(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            
            // 날짜만 비교 (시간 제외)
            eventStart.setHours(0, 0, 0, 0);
            eventEnd.setHours(23, 59, 59, 999);
            date.setHours(12, 0, 0, 0);
            
            return date >= eventStart && date <= eventEnd;
        });
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
     * 오늘 날짜 표시
     */
    markToday() {
        const todayCell = this.container.querySelector('.calendar-cell.today');
        if (todayCell) {
            todayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    /**
     * 오늘 날짜 강조
     */
    highlightToday() {
        const todayCell = this.container.querySelector('.calendar-cell.today');
        if (todayCell) {
            todayCell.classList.add('highlight');
            setTimeout(() => {
                todayCell.classList.remove('highlight');
            }, 2000);
        }
    }
    
    /**
     * 이벤트 리스너 연결
     */
    attachEventListeners() {
        // 날짜 셀 클릭
        this.container.querySelectorAll('.calendar-cell:not(.other-month)').forEach(cell => {
            cell.addEventListener('click', (e) => {
                // 이벤트 태그를 클릭한 경우
                if (e.target.closest('.event-tag')) {
                    const eventTag = e.target.closest('.event-tag');
                    const eventId = eventTag.dataset.eventId;
                    this.handleEventClick(eventId);
                    return;
                }
                
                // 날짜 셀을 클릭한 경우
                const date = parseInt(cell.dataset.date);
                const clickedDate = new Date(this.currentYear, this.currentMonth, date);
                this.handleDateClick(clickedDate);
            });
        });
        
        // 이벤트 태그 호버
        this.container.querySelectorAll('.event-tag').forEach(tag => {
            tag.addEventListener('mouseenter', (e) => {
                this.showEventTooltip(e);
            });
            
            tag.addEventListener('mouseleave', () => {
                this.hideEventTooltip();
            });
        });
    }
    
    /**
     * 이벤트 클릭 처리
     */
    handleEventClick(eventId) {
        if (this.options.onEventClick) {
            // 이벤트 데이터 찾기
            const event = this.findEventById(eventId);
            if (event) {
                this.options.onEventClick(event);
            }
        }
    }
    
    /**
     * 날짜 클릭 처리
     */
    handleDateClick(date) {
        if (this.options.onDateClick) {
            this.options.onDateClick(date);
        }
    }
    
    /**
     * ID로 이벤트 찾기
     */
    findEventById(eventId) {
        // 현재 렌더링된 이벤트에서 찾기
        // 실제 구현시 전체 이벤트 데이터 참조 필요
        return null;
    }
    
    /**
     * 이벤트 툴팁 표시
     */
    showEventTooltip(e) {
        const eventTag = e.currentTarget;
        const title = eventTag.getAttribute('title');
        
        if (window.TooltipManager) {
            window.TooltipManager.show({
                x: e.pageX,
                y: e.pageY,
                content: title
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
    
    /**
     * 이전 달로 이동
     */
    prevMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
    }
    
    /**
     * 다음 달로 이동
     */
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
    }
}