// ========== year-calendar.js ==========
export const YearCalendar = {
    render(container, date, deliveryData, holidays) {
        const year = date.getFullYear();
        const html = this.generateYearHTML(year, deliveryData, holidays);
        container.innerHTML = html;
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