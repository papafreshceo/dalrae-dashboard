// components/delivery-calendar-grid.js
export class DeliveryCalendarGrid extends HTMLElement {
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
        
        // 이전 달 빈 칸
        for (let i = 0; i < startDay; i++) {
            html += `<div class="day-cell other-month"></div>`;
        }
        
        // 현재 달 날짜들
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

            // 배송 아이콘 설정
            if (deliveryInfo.deliveryType === 'special') {
                deliveryIcon = `<div class="delivery-icon special">${this.getDeliveryIcon('special')}</div>`;
            } else if (deliveryInfo.deliveryType === 'normal') {
                deliveryIcon = `<div class="delivery-icon available">${this.getDeliveryIcon('available')}</div>`;
            } else {
                deliveryIcon = `<div class="delivery-icon unavailable">${this.getDeliveryIcon('unavailable')}</div>`;
            }

            // 배지 설정
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
        
        // 다음 달 빈 칸
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

customElements.define('delivery-calendar-grid', DeliveryCalendarGrid);
