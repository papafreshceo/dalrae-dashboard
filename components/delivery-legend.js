// delivery-legend.js
export class DeliveryLegend extends HTMLElement {
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

// 커스텀 엘리먼트 등록
customElements.define('delivery-legend', DeliveryLegend);
