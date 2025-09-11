/**
 * 상품 모달 Web Component
 * 재사용 가능한 독립적인 모달 컴포넌트
 */
class ProductModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentVariety = null;
        this.products = [];
    }
    
    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                    justify-content: center;
                    align-items: center;
                    padding: 10px;
                    animation: fadeIn 0.2s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .modal.show {
                    display: flex;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 1200px;
                    max-height: 85vh;
                    overflow-y: auto;
                    padding: 30px;
                    animation: slideUp 0.3s ease;
                }
                
                .modal-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .modal-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #212529;
                    margin-bottom: 8px;
                }
                
                .modal-subtitle {
                    font-size: 14px;
                    color: #6c757d;
                }
                
                .modal-body {
                    margin-bottom: 20px;
                }
                
                .option-card {
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    margin-bottom: 10px;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                
                .option-card:hover {
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transform: translateY(-1px);
                }
                
                .option-top-row {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    margin-bottom: 10px;
                }
                
                .option-thumb {
                    width: 60px;
                    height: 60px;
                    border-radius: 6px;
                    object-fit: cover;
                    background: #dee2e6;
                    flex-shrink: 0;
                }
                
                .option-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-width: 0;
                }
                
                .option-name {
                    font-weight: 600;
                    color: #212529;
                    font-size: 14px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .option-specs {
                    font-size: 12px;
                    color: #6c757d;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .option-price {
                    flex-shrink: 0;
                    text-align: right;
                }
                
                .price-amount {
                    font-size: 18px;
                    font-weight: 700;
                    color: #212529;
                }
                
                .option-badges {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    align-items: center;
                    padding-left: 72px;
                }
                
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .status-active {
                    background: #d4edda;
                    color: #155724;
                }
                
                .status-paused {
                    background: #fff3cd;
                    color: #856404;
                }
                
                .status-stopped {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .badge-free {
                    background: #e7f3ff;
                    color: #004085;
                    padding: 3px 10px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 500;
                }
                
                .badge-chart {
                    background: #2563eb;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 500;
                    cursor: pointer;
                    display: inline-block;
                    transition: all 0.2s;
                    border: none;
                }
                
                .badge-chart:hover {
                    background: #1d4ed8;
                    transform: translateY(-1px);
                }
                
                .modal-footer {
                    display: flex;
                    gap: 10px;
                }
                
                .modal-btn {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-height: 44px;
                }
                
                .modal-btn-secondary {
                    background: #f8f9fa;
                    color: #495057;
                    border: 1px solid #dee2e6;
                }
                
                .modal-btn-secondary:hover {
                    background: #e9ecef;
                }
                
                .modal-btn-primary {
                    background: #2563eb;
                    color: white;
                }
                
                .modal-btn-primary:hover {
                    background: #1d4ed8;
                }
                
                .no-data {
                    text-align: center;
                    padding: 60px 20px;
                    color: #6c757d;
                }
                
                .no-data-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    color: #dee2e6;
                }
                
                @media (max-width: 768px) {
                    .modal {
                        padding: 5px;
                    }
                    
                    .modal-content {
                        padding: 20px 15px;
                        max-height: 95vh;
                    }
                    
                    .option-card {
                        padding: 12px;
                    }
                    
                    .option-thumb {
                        width: 50px;
                        height: 50px;
                    }
                    
                    .option-badges {
                        padding-left: 62px;
                    }
                    
                    .price-amount {
                        font-size: 16px;
                    }
                }
                
                @media (max-width: 480px) {
                    .modal {
                        padding: 0;
                    }
                    
                    .modal-content {
                        width: 100%;
                        height: 100%;
                        max-height: 100vh;
                        border-radius: 0;
                    }
                    
                    .modal-header {
                        position: sticky;
                        top: 0;
                        background: white;
                        z-index: 10;
                        padding-top: 15px;
                    }
                    
                    .option-badges {
                        padding-left: 0;
                        margin-top: 8px;
                    }
                }
            </style>
            
            <div class="modal" id="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title" id="modalTitle">상품 옵션</h2>
                        <p class="modal-subtitle" id="modalSubtitle">옵션을 선택하세요</p>
                    </div>
                    
                    <div class="modal-body" id="modalBody">
                        <div class="no-data">
                            <div class="no-data-icon">📦</div>
                            <div>상품을 불러오는 중...</div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="modal-btn modal-btn-secondary" id="closeBtn">닫기</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        const modal = this.shadowRoot.getElementById('modal');
        const closeBtn = this.shadowRoot.getElementById('closeBtn');
        
        // 닫기 버튼
        closeBtn.addEventListener('click', () => this.close());
        
        // 배경 클릭으로 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
        
        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }
    
    async show(variety) {
        this.currentVariety = variety;
        
        try {
            // 데이터 로드
            this.products = await DataService.getProductsByVariety(variety);
            
            if (this.products.length === 0) {
                this.showNoData();
                return;
            }
            
            // 모달 표시
            const modal = this.shadowRoot.getElementById('modal');
            modal.classList.add('show');
            
            // 제목 설정
            const title = this.shadowRoot.getElementById('modalTitle');
            const subtitle = this.shadowRoot.getElementById('modalSubtitle');
            title.innerHTML = `${variety} <span style="color: #6c757d; font-size: 18px;">(${this.products.length}개)</span>`;
            subtitle.textContent = '상품 옵션을 확인하세요';
            
            // 내용 렌더링
            this.renderProducts();
            
        } catch (error) {
            console.error('상품 로드 실패:', error);
            this.showError();
        }
    }
    
    renderProducts() {
        const body = this.shadowRoot.getElementById('modalBody');
        let html = '';
        
        this.products.forEach(p => {
            const price = p.셀러공급가 ? 
                         Number(p.셀러공급가.replace(/,/g, '')).toLocaleString() : 
                         '0';
            
            let statusClass = 'status-active';
            if (p.공급상태 === '시즌종료') statusClass = 'status-paused';
            if (p.공급상태 === '공급중지') statusClass = 'status-stopped';
            
            let specs = '';
            if (p.규격1) specs += p.규격1;
            if (p.규격2) specs += (specs ? ' ' : '') + p.규격2;
            if (p.규격3) specs += (specs ? ' ' : '') + p.규격3;
            
            html += `
                <div class="option-card" data-code="${p.옵션코드}">
                    <div class="option-top-row">
                        ${p.썸네일 ? 
                            `<img src="${p.썸네일}" class="option-thumb" alt="${p.옵션명}">` :
                            `<div class="option-thumb"></div>`
                        }
                        <div class="option-details">
                            <div class="option-name">${p.옵션명 || '옵션명 없음'}</div>
                            <div class="option-specs">${specs}</div>
                        </div>
                        <div class="option-price">
                            <span class="price-amount">${price}원</span>
                        </div>
                    </div>
                    <div class="option-badges">
                        <span class="status-badge ${statusClass}">
                            ${p.공급상태 || '미정'}
                        </span>
                        <span class="badge-free">무료배송</span>
                        <button class="badge-chart" data-code="${p.옵션코드}" data-name="${p.옵션명}">
                            가격차트
                        </button>
                    </div>
                </div>
            `;
        });
        
        body.innerHTML = html;
        
        // 차트 버튼 이벤트
        const chartButtons = body.querySelectorAll('.badge-chart');
        chartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const code = btn.dataset.code;
                const name = btn.dataset.name;
                this.showPriceChart(code, name);
            });
        });
    }
    
    showPriceChart(optionCode, optionName) {
        // 가격 차트 이벤트 발생
        this.dispatchEvent(new CustomEvent('show-price-chart', {
            detail: { optionCode, optionName },
            bubbles: true,
            composed: true
        }));
    }
    
    showNoData() {
        const body = this.shadowRoot.getElementById('modalBody');
        body.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📦</div>
                <div>해당 품종의 상품이 없습니다.</div>
            </div>
        `;
        
        const modal = this.shadowRoot.getElementById('modal');
        modal.classList.add('show');
    }
    
    showError() {
        const body = this.shadowRoot.getElementById('modalBody');
        body.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">⚠️</div>
                <div>상품을 불러올 수 없습니다.</div>
            </div>
        `;
        
        const modal = this.shadowRoot.getElementById('modal');
        modal.classList.add('show');
    }
    
    close() {
        const modal = this.shadowRoot.getElementById('modal');
        modal.classList.remove('show');
    }
    
    isOpen() {
        const modal = this.shadowRoot.getElementById('modal');
        return modal.classList.contains('show');
    }
}

// Web Component 등록
customElements.define('product-modal', ProductModal);
