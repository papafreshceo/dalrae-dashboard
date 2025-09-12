// components/delivery-notices.js
export class DeliveryNotices extends HTMLElement {
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
            // 기본 공지사항 표시
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
            // 실제 공지사항 표시
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
        
        // 이벤트 리스너 추가
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
        
        // 다른 모든 공지사항 닫기
        const allContents = this.shadowRoot.querySelectorAll('.notice-content');
        const allButtons = this.shadowRoot.querySelectorAll('.toggle-btn');
        
        allContents.forEach(el => el.classList.remove('open'));
        allButtons.forEach(btn => btn.classList.remove('open'));
        
        // 현재 공지사항 토글
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

customElements.define('delivery-notices', DeliveryNotices);
