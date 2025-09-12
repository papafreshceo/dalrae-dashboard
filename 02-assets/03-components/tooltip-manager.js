/**
 * 툴팁 매니저 Web Component
 * 화면 경계 자동 감지 및 위치 조정
 * 어디서든 재사용 가능한 독립적인 툴팁 시스템
 */
class TooltipManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentTooltip = null;
        this.hideTimeout = null;
    }
    
    connectedCallback() {
        this.render();
        this.setupGlobalListeners();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .tooltip {
                    position: fixed;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 100000;
                    min-width: 200px;
                    max-width: 350px;
                    display: none;
                    pointer-events: none;
                    animation: fadeIn 0.2s ease;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .tooltip.show {
                    display: block;
                }
                
                /* 위치별 스타일 */
                .tooltip.position-top::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 6px solid transparent;
                    border-top-color: white;
                }
                
                .tooltip.position-bottom::before {
                    content: '';
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 6px solid transparent;
                    border-bottom-color: white;
                }
                
                .tooltip.position-left::after {
                    content: '';
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    border: 6px solid transparent;
                    border-left-color: white;
                }
                
                .tooltip.position-right::before {
                    content: '';
                    position: absolute;
                    right: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    border: 6px solid transparent;
                    border-right-color: white;
                }
                
                .tooltip-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #f1f3f5;
                }
                
                .tooltip-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                
                .tooltip-icon.type-info {
                    background: #e7f3ff;
                    color: #2563eb;
                }
                
                .tooltip-icon.type-success {
                    background: #d4edda;
                    color: #155724;
                }
                
                .tooltip-icon.type-warning {
                    background: #fff3cd;
                    color: #856404;
                }
                
                .tooltip-icon.type-error {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .tooltip-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #212529;
                }
                
                .tooltip-content {
                    font-size: 12px;
                    color: #6c757d;
                    line-height: 1.5;
                }
                
                .tooltip-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                }
                
                .tooltip-label {
                    font-weight: 500;
                    color: #495057;
                }
                
                .tooltip-value {
                    color: #212529;
                    font-weight: 600;
                }
                
                .tooltip-footer {
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px solid #f1f3f5;
                    font-size: 11px;
                    color: #adb5bd;
                }
                
                /* 모바일 대응 */
                @media (max-width: 768px) {
                    .tooltip {
                        max-width: 280px;
                    }
                }
            </style>
            
            <div class="tooltip" id="tooltip">
                <div class="tooltip-header" id="tooltipHeader">
                    <div class="tooltip-icon type-info" id="tooltipIcon">ℹ</div>
                    <div class="tooltip-title" id="tooltipTitle">정보</div>
                </div>
                <div class="tooltip-content" id="tooltipContent">
                    내용이 여기에 표시됩니다.
                </div>
            </div>
        `;
    }
    
    setupGlobalListeners() {
        // 전역 스크롤이나 리사이즈 시 툴팁 숨기기
        window.addEventListener('scroll', () => this.hide(), { passive: true });
        window.addEventListener('resize', () => this.hide(), { passive: true });
    }
    
    /**
     * 툴팁 표시
     * @param {Object} options - 툴팁 옵션
     * @param {number} options.x - X 좌표
     * @param {number} options.y - Y 좌표
     * @param {string} options.title - 제목
     * @param {string|Object} options.content - 내용
     * @param {string} options.type - 타입 (info, success, warning, error)
     * @param {number} options.delay - 표시 지연 시간 (ms)
     */
    show(options) {
        const {
            x,
            y,
            title = '',
            content = '',
            type = 'info',
            delay = 0
        } = options;
        
        // 이전 타임아웃 취소
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        
        // 지연 표시
        setTimeout(() => {
            this.renderTooltip(title, content, type);
            this.positionTooltip(x, y);
        }, delay);
    }
    
    /**
     * 상품 정보 툴팁 표시
     * @param {Event} event - 마우스 이벤트
     * @param {Object} product - 상품 정보
     */
    showProduct(event, product) {
        let content = '';
        
        if (product.item) {
            content = `
                <div class="tooltip-row">
                    <span class="tooltip-label">품목:</span>
                    <span class="tooltip-value">${product.item}</span>
                </div>
            `;
        }
        
        if (product.startMonth !== undefined && product.endMonth !== undefined) {
            content += `
                <div class="tooltip-row">
                    <span class="tooltip-label">기간:</span>
                    <span class="tooltip-value">${product.startMonth + 1}/${product.startDay} ~ ${product.endMonth + 1}/${product.endDay}</span>
                </div>
            `;
        } else if (product.시작일 && product.종료일) {
            content += `
                <div class="tooltip-row">
                    <span class="tooltip-label">기간:</span>
                    <span class="tooltip-value">${product.시작일} ~ ${product.종료일}</span>
                </div>
            `;
        }
        
        const status = product.status || product.원물공급상태 || product.공급상태 || '확인 필요';
        content += `
            <div class="tooltip-row">
                <span class="tooltip-label">상태:</span>
                <span class="tooltip-value">${status}</span>
            </div>
        `;
        
        if (product.options && product.options.length > 0) {
            content += `
                <div class="tooltip-row">
                    <span class="tooltip-label">옵션:</span>
                    <span class="tooltip-value">${product.options.length}개</span>
                </div>
            `;
        }
        
        const title = product.name || product.품종 || product.품목;
        
        this.show({
            x: event.pageX,
            y: event.pageY,
            title: title,
            content: content,
            type: 'info'
        });
    }
    
    /**
     * 간단한 텍스트 툴팁
     * @param {Event} event - 마우스 이벤트
     * @param {string} text - 표시할 텍스트
     */
    showText(event, text) {
        this.show({
            x: event.pageX,
            y: event.pageY,
            content: text,
            type: 'info'
        });
    }
    
    renderTooltip(title, content, type) {
        const tooltip = this.shadowRoot.getElementById('tooltip');
        const tooltipIcon = this.shadowRoot.getElementById('tooltipIcon');
        const tooltipTitle = this.shadowRoot.getElementById('tooltipTitle');
        const tooltipContent = this.shadowRoot.getElementById('tooltipContent');
        const tooltipHeader = this.shadowRoot.getElementById('tooltipHeader');
        
        // 아이콘 설정
        tooltipIcon.className = `tooltip-icon type-${type}`;
        const icons = {
            info: 'ℹ',
            success: '✓',
            warning: '⚠',
            error: '✕'
        };
        tooltipIcon.textContent = icons[type] || icons.info;
        
        // 제목이 있는 경우만 헤더 표시
        if (title) {
            tooltipHeader.style.display = 'flex';
            tooltipTitle.textContent = title;
        } else {
            tooltipHeader.style.display = 'none';
        }
        
        // 내용 설정 (HTML 허용)
        if (typeof content === 'string') {
            tooltipContent.innerHTML = content;
        } else {
            tooltipContent.textContent = JSON.stringify(content);
        }
        
        tooltip.classList.add('show');
    }
    
    positionTooltip(x, y) {
        const tooltip = this.shadowRoot.getElementById('tooltip');
        const rect = tooltip.getBoundingClientRect();
        const padding = 10;
        
        // 화면 크기
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 기본 위치 (마우스 오른쪽 아래)
        let left = x + padding;
        let top = y + padding;
        let positionClass = '';
        
        // 오른쪽 경계 체크
        if (left + rect.width > viewportWidth - padding) {
            // 왼쪽에 표시
            left = x - rect.width - padding;
            positionClass = 'position-left';
        } else {
            positionClass = 'position-right';
        }
        
        // 하단 경계 체크
        if (top + rect.height > viewportHeight - padding) {
            // 위쪽에 표시
            top = y - rect.height - padding;
            if (positionClass === 'position-right') {
                positionClass = 'position-top';
            }
        } else {
            if (positionClass === 'position-right') {
                positionClass = 'position-bottom';
            }
        }
        
        // 왼쪽 경계 체크
        if (left < padding) {
            left = padding;
        }
        
        // 상단 경계 체크
        if (top < padding) {
            top = padding;
        }
        
        // 위치 적용
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        
        // 위치 클래스 초기화 및 적용
        tooltip.className = 'tooltip show';
        if (positionClass) {
            tooltip.classList.add(positionClass);
        }
    }
    
    /**
     * 툴팁 숨기기
     * @param {number} delay - 숨기기 지연 시간 (ms)
     */
    hide(delay = 0) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        
        this.hideTimeout = setTimeout(() => {
            const tooltip = this.shadowRoot.getElementById('tooltip');
            tooltip.classList.remove('show');
        }, delay);
    }
    
    /**
     * 툴팁 고정 (자동으로 사라지지 않음)
     */
    pin() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
}

// Web Component 등록
customElements.define('tooltip-manager', TooltipManager);

// 전역 API 제공
window.TooltipManager = {
    instance: null,
    
    init() {
        if (!this.instance) {
            this.instance = document.createElement('tooltip-manager');
            document.body.appendChild(this.instance);
        }
        return this.instance;
    },
    
    show(options) {
        this.init().show(options);
    },
    
    showProduct(event, product) {
        this.init().showProduct(event, product);
    },
    
    showText(event, text) {
        this.init().showText(event, text);
    },
    
    hide(delay) {
        if (this.instance) {
            this.instance.hide(delay);
        }
    },
    
    pin() {
        if (this.instance) {
            this.instance.pin();
        }
    }
};
