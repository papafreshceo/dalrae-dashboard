/**
 * calendar-modal.js
 * 캘린더 모달 관리 모듈
 */

export class CalendarModal {
    constructor() {
        this.modal = null;
        this.currentVariety = null;
        this.createModal();
        this.setupEventListeners();
    }
    
    /**
     * 모달 생성
     */
    createModal() {
        // 기존 모달이 있으면 제거
        const existing = document.getElementById('calendarModal');
        if (existing) {
            existing.remove();
        }
        
        // 모달 HTML 생성
        const modalHtml = `
            <div class="modal" id="calendarModal">
                <div class="modal-content calendar-modal-content">
                    <div class="modal-header">
                        <h2 id="calendarModalTitle">상품 정보</h2>
                        <button class="modal-close" id="calendarModalClose">×</button>
                    </div>
                    <div class="modal-body" id="calendarModalBody">
                        <!-- 동적으로 생성됨 -->
                    </div>
                </div>
            </div>
        `;
        
        // DOM에 추가
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('calendarModal');
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 닫기 버튼
        document.getElementById('calendarModalClose').addEventListener('click', () => {
            this.hide();
        });
        
        // 모달 바깥 클릭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
        
        // ESC 키
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hide();
            }
        });
    }
    
    /**
     * 상품 목록 표시
     */
    showProducts(variety, products) {
        this.currentVariety = variety;
        
        // 제목 설정
        document.getElementById('calendarModalTitle').textContent = variety;
        
        // 내용 렌더링
        this.renderProductsList(products);
        
        // 모달 표시
        this.show();
    }
    
    /**
     * 상품 목록 렌더링
     */
    renderProductsList(products) {
        const body = document.getElementById('calendarModalBody');
        
        if (products.length === 0) {
            body.innerHTML = this.getNoDataHTML();
            return;
        }
        
        let html = '<div class="products-modal-list">';
        
        products.forEach(product => {
            html += this.createProductCard(product);
        });
        
        html += '</div>';
        
        body.innerHTML = html;
        
        // 이벤트 리스너 추가
        this.attachProductEvents();
    }
    
    /**
     * 상품 카드 생성
     */
    createProductCard(product) {
        const status = product.원물공급상태 || product.공급상태 || '';
        const statusClass = this.getStatusClass(status);
        const price = this.formatPrice(product.공급가);
        const specs = this.formatSpecs(product);
        const thumbnailUrl = product.썸네일 || '';
        
        return `
            <div class="product-modal-card" data-product-id="${product.상품코드}">
                <div class="product-modal-image">
                    ${thumbnailUrl ? 
                        `<img src="${thumbnailUrl}" alt="${product.상품명}">` :
                        '<div class="no-image">이미지 없음</div>'
                    }
                </div>
                
                <div class="product-modal-info">
                    <div class="product-modal-header">
                        <h3>${product.상품명}</h3>
                        <span class="status-badge ${statusClass}">${status}</span>
                    </div>
                    
                    <div class="product-modal-details">
                        ${product.품종 ? `<p class="variety">품종: ${product.품종}</p>` : ''}
                        ${product.옵션명 ? `<p class="option">옵션: ${product.옵션명}</p>` : ''}
                        ${specs ? `<p class="specs">규격: ${specs}</p>` : ''}
                        ${product.원산지 ? `<p class="origin">원산지: ${product.원산지}</p>` : ''}
                        ${product.출하단위 ? `<p class="unit">출하단위: ${product.출하단위}</p>` : ''}
                    </div>
                    
                    <div class="product-modal-footer">
                        <div class="price-info">
                            <span class="price-label">공급가</span>
                            <span class="price-value">${price}원</span>
                        </div>
                        
                        <div class="product-badges">
                            ${product.무료배송 === 'O' ? 
                                '<span class="badge badge-free">무료배송</span>' : ''
                            }
                            ${product.상세보기 === 'O' ? 
                                '<span class="badge badge-detail">상세</span>' : ''
                            }
                            ${product.이미지 === 'O' ? 
                                '<span class="badge badge-image">이미지</span>' : ''
                            }
                        </div>
                    </div>
                    
                    <div class="product-modal-actions">
                        ${product.옵션코드 ? 
                            `<button class="btn-chart" 
                                     data-code="${product.옵션코드}"
                                     data-name="${this.escapeHtml(product.옵션명)}">
                                가격 차트
                            </button>` : ''
                        }
                        <button class="btn-order" data-product-id="${product.상품코드}">
                            빠른 주문
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * 이벤트 선택 모달 표시
     */
    showEventSelection(events, date) {
        const dateStr = this.formatDate(date);
        
        // 제목 설정
        document.getElementById('calendarModalTitle').textContent = `${dateStr} 상품`;
        
        // 내용 렌더링
        this.renderEventSelection(events);
        
        // 모달 표시
        this.show();
    }
    
    /**
     * 이벤트 선택 렌더링
     */
    renderEventSelection(events) {
        const body = document.getElementById('calendarModalBody');
        
        let html = '<div class="event-selection-list">';
        
        events.forEach(event => {
            const statusClass = this.getStatusClass(event.status);
            
            html += `
                <div class="event-selection-item ${statusClass}" 
                     data-variety="${event.variety || event.title}">
                    <div class="event-selection-info">
                        <h4>${event.variety || event.title}</h4>
                        <p>${event.category || ''}</p>
                    </div>
                    <div class="event-selection-status">
                        ${event.status || ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        body.innerHTML = html;
        
        // 이벤트 리스너 추가
        body.querySelectorAll('.event-selection-item').forEach(item => {
            item.addEventListener('click', () => {
                const variety = item.dataset.variety;
                this.hide();
                
                // 상품 모달 표시 이벤트 발생
                document.dispatchEvent(new CustomEvent('show-modal', {
                    detail: { variety }
                }));
            });
        });
    }
    
    /**
     * 데이터 없음 표시
     */
    showNoData(variety) {
        document.getElementById('calendarModalTitle').textContent = variety;
        document.getElementById('calendarModalBody').innerHTML = this.getNoDataHTML();
        this.show();
    }
    
    /**
     * 데이터 없음 HTML
     */
    getNoDataHTML() {
        return `
            <div class="no-data-message">
                <div class="no-data-icon">📦</div>
                <div class="no-data-text">
                    해당 품종의 상품 정보가 없습니다.
                </div>
            </div>
        `;
    }
    
    /**
     * 상품 이벤트 연결
     */
    attachProductEvents() {
        // 가격 차트 버튼
        this.modal.querySelectorAll('.btn-chart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = btn.dataset.code;
                const name = btn.dataset.name;
                
                // 가격 차트 이벤트 발생
                document.dispatchEvent(new CustomEvent('show-price-chart', {
                    detail: { optionCode: code, optionName: name }
                }));
            });
        });
        
        // 빠른 주문 버튼
        this.modal.querySelectorAll('.btn-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.dataset.productId;
                
                // 발주시스템으로 이동
                alert('발주시스템으로 이동합니다.');
                window.open('https://papafarmers.com/orders/', '_blank');
            });
        });
    }
    
    /**
     * 모달 표시
     */
    show() {
        this.modal.classList.add('show');
    }
    
    /**
     * 모달 숨기기
     */
    hide() {
        this.modal.classList.remove('show');
        this.currentVariety = null;
    }
    
    /**
     * 유틸리티 함수들
     */
    formatPrice(price) {
        if (!price) return '0';
        const numPrice = parseInt(String(price).replace(/,/g, ''));
        return numPrice.toLocaleString();
    }
    
    formatSpecs(product) {
        const specs = [];
        if (product.규격1) specs.push(product.규격1);
        if (product.규격2) specs.push(product.규격2);
        if (product.규격3) specs.push(product.규격3);
        return specs.join(' ') || '';
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
    
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