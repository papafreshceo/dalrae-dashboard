// delivery-calendar.js - 메인 컴포넌트
import { deliveryDataService } from './services/delivery-data-service.js';
import './components/delivery-calendar-nav.js';
import './components/delivery-calendar-grid.js';
import './components/delivery-notices.js';
import './components/delivery-legend.js';

export class DeliveryCalendar extends HTMLElement {
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
            // 전체 데이터 로드
            this.deliveryData = await deliveryDataService.processDeliveryData();
            
            // 공지사항 업데이트
            const notices = await deliveryDataService.getNotices();
            const noticesComponent = this.shadowRoot.querySelector('delivery-notices');
            if (noticesComponent) {
                noticesComponent.updateNotices(notices);
            }
            
            // 캘린더 업데이트
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
            
            // 현재 월의 데이터만 필터링
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

    // Public API
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

// 커스텀 엘리먼트 등록
customElements.define('delivery-calendar', DeliveryCalendar);

// 전역 객체로 내보내기 (선택사항)
window.DeliveryCalendar = DeliveryCalendar;
