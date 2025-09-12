/**
 * dashboard-modal.js
 * 대시보드 모달 관리 모듈
 */

export class DashboardModal {
    constructor() {
        this.optionsModal = document.getElementById('optionsModal');
        this.chartModal = document.getElementById('chartModal');
        this.setupEventListeners();
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 모달 닫기 버튼
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAll());
        });
        
        // 모달 바깥 클릭시 닫기
        [this.optionsModal, this.chartModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeAll();
                    }
                });
            }
        });
        
        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    }
    
    /**
     * 옵션 모달 표시
     */
    showOptions(productName, options) {
        if (!this.optionsModal) return;
        
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = `${productName} 옵션`;
        
        if (!options || options.length === 0) {
            modalBody.innerHTML = this.getNoDataHTML('옵션이 없습니다');
        } else {
            modalBody.innerHTML = this.createOptionsHTML(options);
        }
        
        this.optionsModal.classList.add('show');
        
        // 차트 버튼 이벤트 추가
        this.attachChartButtonEvents();
    }
    
    /**
     * 옵션 HTML 생성
     */
    createOptionsHTML(options) {
        let html = '<div class="options-grid">';
        
        options.forEach(option => {
            const status = this.getSupplyStatus(option);
            const statusClass = this.getStatusClass(status);
            const price = this.formatPrice(option.공급가);
            const specs = this.formatSpecs(option);
            
            html += `
                <div class="option-card" data-code="${option.옵션코드}">
                    <div class="option-thumb-container">
                        ${option.썸네일 ? 
                            `<img src="${option.썸네일}" class="option-thumb" alt="${option.옵션명}">` :
                            `<div class="option-thumb empty"></div>`
                        }
                    </div>
                    
                    <div class="option-info">
                        <div class="option-col-name">${option.옵션명 || '옵션명 없음'}</div>
                        <div class="option-col-spec">${specs}</div>
                        <div class="option-col-ship-label">출하단위</div>
                        <div class="option-col-ship">${option.출하단위 || '-'}</div>
                        
                        <div class="option-col-right">
                            <span class="status-badge ${statusClass}">${status}</span>
                            <span class="price-display">${price}원</span>
                            ${option.무료배송 === 'O' ? 
                                '<span class="badge-free">무료배송</span>' : ''
                            }
                            <button class="chart-btn" 
                                    data-code="${option.옵션코드}" 
                                    data-name="${this.escapeHtml(option.옵션명)}">
                                가격차트
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    /**
     * 차트 버튼 이벤트 연결
     */
    attachChartButtonEvents() {
        const buttons = this.optionsModal.querySelectorAll('.chart-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const code = btn.dataset.code;
                const name = btn.dataset.name;
                
                // 옵션 모달 닫기
                this.closeOptions();
                
                // 차트 표시 이벤트 발생
                window.dashboard.showPriceChart(code, name);
            });
        });
    }
    
    /**
     * 공급상태 가져오기
     */
    getSupplyStatus(product) {
        return product.원물공급상태 || product.공급상태 || '';
    }
    
    /**
     * 상태 클래스 가져오기
     */
    getStatusClass(status) {
        const classMap = {
            '공급중': 'status-active',
            '출하준비중': 'status-preparing',
            '잠시만요': 'status-warning',
            '시즌종료': 'status-paused',
            '공급중지': 'status-stopped'
        };
        return classMap[status] || '';
    }
    
    /**
     * 가격 포맷팅
     */
    formatPrice(price) {
        if (!price) return '0';
        
        const numPrice = parseInt(String(price).replace(/,/g, ''));
        return numPrice.toLocaleString();
    }
    
    /**
     * 규격 포맷팅
     */
    formatSpecs(option) {
        const specs = [];
        
        if (option.규격1) specs.push(option.규격1);
        if (option.규격2) specs.push(option.규격2);
        if (option.규격3) specs.push(option.규격3);
        
        return specs.join(' ') || '-';
    }
    
    /**
     * HTML 이스케이프
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
    
    /**
     * 데이터 없음 HTML
     */
    getNoDataHTML(message) {
        return `
            <div class="no-data-message">
                <div class="no-data-icon"></div>
                <div class="no-data-title">${message}</div>
            </div>
        `;
    }
    
    /**
     * 옵션 모달 닫기
     */
    closeOptions() {
        if (this.optionsModal) {
            this.optionsModal.classList.remove('show');
        }
    }
    
    /**
     * 차트 모달 닫기
     */
    closeChart() {
        if (this.chartModal) {
            this.chartModal.classList.remove('show');
        }
    }
    
    /**
     * 모든 모달 닫기
     */
    closeAll() {
        this.closeOptions();
        this.closeChart();
    }
}