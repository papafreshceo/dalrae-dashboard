// delivery-calendar-nav.js
export class DeliveryCalendarNav extends HTMLElement {
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

// 커스텀 엘리먼트 등록
customElements.define('delivery-calendar-nav', DeliveryCalendarNav);
