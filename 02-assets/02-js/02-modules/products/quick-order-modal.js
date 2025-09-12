/**
 * quick-order-modal.js
 * 빠른 주문 모달 모듈
 */

export class QuickOrderModal {
    constructor() {
        this.modal = null;
        this.currentProduct = null;
        this.createModal();
        this.setupEventListeners();
    }
    
    /**
     * 모달 생성
     */
    createModal() {
        // 기존 모달이 있으면 제거
        const existing = document.getElementById('quickOrderModal');
        if (existing) {
            existing.remove();
        }
        
        // 모달 HTML 생성
        const modalHtml = `
            <div class="modal" id="quickOrderModal">
                <div class="modal-content quick-order-content">
                    <div class="modal-header">
                        <h2 id="quickOrderTitle">빠른 주문</h2>
                        <button class="modal-close" id="quickOrderClose">×</button>
                    </div>
                    <div class="modal-body" id="quickOrderBody">
                        <!-- 동적으로 생성됨 -->
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="quickOrderCancel">취소</button>
                        <button class="btn btn-primary" id="quickOrderSubmit">주문하기</button>
                    </div>
                </div>
            </div>
        `;
        
        // DOM에 추가
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('quickOrderModal');
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 닫기 버튼
        document.getElementById('quickOrderClose').addEventListener('click', () => {
            this.hide();
        });
        
        // 취소 버튼
        document.getElementById('quickOrderCancel').addEventListener('click', () => {
            this.hide();
        });
        
        // 주문 버튼
        document.getElementById('quickOrderSubmit').addEventListener('click', () => {
            this.submitOrder();
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
     * 모달 표시
     */
    show(product) {
        if (!product) return;
        
        this.currentProduct = product;
        
        // 제목 설정
        document.getElementById('quickOrderTitle').textContent = 
            `빠른 주문 - ${product.상품명}`;
        
        // 내용 렌더링
        this.renderContent(product);
        
        // 모달 표시
        this.modal.classList.add('show');
        
        // 첫 번째 입력 필드에 포커스
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
    
    /**
     * 모달 내용 렌더링
     */
    renderContent(product) {
        const body = document.getElementById('quickOrderBody');
        
        const status = product.원물공급상태 || product.공급상태 || '';
        const price = this.formatPrice(product.공급가);
        const specs = this.formatSpecs(product);
        const thumbnailUrl = product.썸네일 || '';
        
        const html = `
            <div class="quick-order-form">
                <!-- 상품 정보 -->
                <div class="product-info-section">
                    <div class="product-image">
                        ${thumbnailUrl ? 
                            `<img src="${thumbnailUrl}" alt="${product.상품명}">` :
                            '<div class="no-image">이미지 없음</div>'
                        }
                    </div>
                    <div class="product-details">
                        <h3>${product.상품명}</h3>
                        <p class="variety">${product.품종 || ''}</p>
                        <p class="option">${product.옵션명 || ''}</p>
                        <p class="specs">${specs}</p>
                        <p class="origin">원산지: ${product.원산지 || '-'}</p>
                        <div class="status-price">
                            <span class="status-badge ${this.getStatusClass(status)}">
                                ${status}
                            </span>
                            <span class="price">${price}원</span>
                        </div>
                    </div>
                </div>
                
                <!-- 주문 양식 -->
                <div class="order-form-section">
                    <div class="form-group">
                        <label for="orderQuantity">주문 수량</label>
                        <div class="quantity-input">
                            <button class="qty-btn minus" data-action="minus">-</button>
                            <input type="number" 
                                   id="orderQuantity" 
                                   value="1" 
                                   min="1" 
                                   max="999">
                            <button class="qty-btn plus" data-action="plus">+</button>
                            <span class="unit">${product.출하단위 || '개'}</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="deliveryDate">희망 배송일</label>
                        <input type="date" 
                               id="deliveryDate" 
                               min="${this.getMinDate()}"
                               value="${this.getDefaultDate()}">
                    </div>
                    
                    <div class="form-group">
                        <label for="orderMemo">요청사항</label>
                        <textarea id="orderMemo" 
                                  rows="3" 
                                  placeholder="배송 시 요청사항을 입력하세요"></textarea>
                    </div>
                    
                    <!-- 주문 요약 -->
                    <div class="order-summary">
                        <div class="summary-row">
                            <span>상품 금액</span>
                            <span id="productTotal">${price}원</span>
                        </div>
                        <div class="summary-row">
                            <span>배송비</span>
                            <span id="shippingFee">
                                ${product.무료배송 === 'O' ? '무료' : '3,000원'}
                            </span>
                        </div>
                        <div class="summary-total">
                            <span>총 주문금액</span>
                            <span id="orderTotal">${this.calculateTotal(product, 1)}원</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        body.innerHTML = html;
        
        // 수량 버튼 이벤트
        this.setupQuantityButtons();
    }
    
    /**
     * 수량 버튼 이벤트 설정
     */
    setupQuantityButtons() {
        const quantityInput = document.getElementById('orderQuantity');
        const qtyButtons = this.modal.querySelectorAll('.qty-btn');
        
        qtyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                let currentQty = parseInt(quantityInput.value) || 1;
                
                if (action === 'plus') {
                    currentQty++;
                } else if (action === 'minus' && currentQty > 1) {
                    currentQty--;
                }
                
                quantityInput.value = currentQty;
                this.updateOrderSummary(currentQty);
            });
        });
        
        // 수량 입력 변경 이벤트
        quantityInput.addEventListener('change', (e) => {
            let qty = parseInt(e.target.value) || 1;
            if (qty < 1) qty = 1;
            if (qty > 999) qty = 999;
            e.target.value = qty;
            this.updateOrderSummary(qty);
        });
    }
    
    /**
     * 주문 요약 업데이트
     */
    updateOrderSummary(quantity) {
        if (!this.currentProduct) return;
        
        const product = this.currentProduct;
        const unitPrice = parseInt(String(product.공급가 || 0).replace(/,/g, ''));
        const productTotal = unitPrice * quantity;
        const shippingFee = product.무료배송 === 'O' ? 0 : 3000;
        const orderTotal = productTotal + shippingFee;
        
        // 금액 업데이트
        document.getElementById('productTotal').textContent = 
            `${productTotal.toLocaleString()}원`;
        document.getElementById('orderTotal').textContent = 
            `${orderTotal.toLocaleString()}원`;
    }
    
    /**
     * 주문 제출
     */
    async submitOrder() {
        const orderData = this.collectOrderData();
        
        if (!this.validateOrder(orderData)) {
            return;
        }
        
        try {
            // 로딩 표시
            this.showLoading();
            
            // 실제로는 API 호출
            // const response = await this.api.submitOrder(orderData);
            
            // 임시: 발주시스템으로 이동
            alert('주문이 접수되었습니다.\n발주시스템으로 이동합니다.');
            window.open('https://papafarmers.com/orders/', '_blank');
            
            this.hide();
            
        } catch (error) {
            console.error('주문 실패:', error);
            alert('주문 처리 중 오류가 발생했습니다.');
            this.hideLoading();
        }
    }
    
    /**
     * 주문 데이터 수집
     */
    collectOrderData() {
        return {
            product: this.currentProduct,
            quantity: parseInt(document.getElementById('orderQuantity').value),
            deliveryDate: document.getElementById('deliveryDate').value,
            memo: document.getElementById('orderMemo').value,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * 주문 유효성 검사
     */
    validateOrder(orderData) {
        if (!orderData.quantity || orderData.quantity < 1) {
            alert('주문 수량을 확인해주세요.');
            return false;
        }
        
        if (!orderData.deliveryDate) {
            alert('희망 배송일을 선택해주세요.');
            return false;
        }
        
        return true;
    }
    
    /**
     * 모달 숨기기
     */
    hide() {
        this.modal.classList.remove('show');
        this.currentProduct = null;
    }
    
    /**
     * 로딩 표시
     */
    showLoading() {
        const submitBtn = document.getElementById('quickOrderSubmit');
        submitBtn.disabled = true;
        submitBtn.textContent = '처리중...';
    }
    
    /**
     * 로딩 숨기기
     */
    hideLoading() {
        const submitBtn = document.getElementById('quickOrderSubmit');
        submitBtn.disabled = false;
        submitBtn.textContent = '주문하기';
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
        return specs.join(' ') || '-';
    }
    
    getStatusClass(status) {
        const classMap = {
            '공급중': 'badge-success',
            '출하준비중': 'badge-info',
            '잠시만요': 'badge-warning',
            '시즌종료': 'badge-secondary',
            '공급중지': 'badge-danger'
        };
        return classMap[status] || 'badge-default';
    }
    
    calculateTotal(product, quantity) {
        const unitPrice = parseInt(String(product.공급가 || 0).replace(/,/g, ''));
        const productTotal = unitPrice * quantity;
        const shippingFee = product.무료배송 === 'O' ? 0 : 3000;
        return (productTotal + shippingFee).toLocaleString();
    }
    
    getMinDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    
    getDefaultDate() {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        return defaultDate.toISOString().split('T')[0];
    }
}