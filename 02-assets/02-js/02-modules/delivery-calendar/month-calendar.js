// ========== month-calendar.js ==========
export const MonthCalendar = {
    render(container, date, deliveryData, holidays) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        const html = this.generateMonthHTML(year, month, deliveryData, holidays);
        container.innerHTML = html;
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