/**
 * products-grid.js
 * 상품 그리드 렌더링 모듈
 */

export class ProductsGrid {
    constructor() {
        this.container = document.getElementById('productsList');
    }
    
    /**
     * 로딩 표시
     */
    showLoading() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <tr>
                <td colspan="10" class="loading-cell">
                    <div class="loading-spinner"></div>
                    <div>상품 데이터를 불러오는 중...</div>
                </td>
            </tr>
        `;
    }
    
    /**
     * 에러 표시
     */
    showError(message) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <tr>
                <td colspan="10" class="error-cell">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">${message}</div>
                </td>
            </tr>
        `;
    }
    
    /**
     * 상품 목록 렌더링
     */
    renderProducts(products) {
        if (!this.container) return;
        
        if (products.length === 0) {
            this.showNoData();
            return;
        }
        
        let html = '';
        
        products.forEach((product, index) => {
            html += this.createProductRow(product, index);
        });
        
        this.container.innerHTML = html;
        
        // 툴팁 초기화
        this.initTooltips();
    }
    
    /**
     * 상품 행 생성
     */
    createProductRow(product, index) {
        const status = this.getSupplyStatus(product);
        const statusClass = this.getStatusClass(status);
        const statusBadgeClass = this.getStatusBadgeClass(status);
        
        // 데이터 추출
        const rowNumber = index + 1;
        const productName = product.상품명 || '-';
        const variety = product.품종 || '-';
        const optionName = product.옵션명 || '-';
        const origin = product.원산지 || '-';
        const price = this.formatPrice(product.공급가);
        const nextDate = this.formatDate(product.다음출하일);
        const isFree = product.무료배송 === 'O';
        const hasDetail = product.상세보기 === 'O';
        const hasImage = product.이미지 === 'O';
        const thumbnailUrl = product.썸네일 || '';
        
        return `
            <tr class="product-row ${statusClass}" data-product-id="${product.상품코드}">
                <td class="text-center">${rowNumber}</td>
                <td class="thumbnail-cell">
                    ${thumbnailUrl ? 
                        `<img src="${thumbnailUrl}" 
                              class="product-thumbnail" 
                              alt="${productName}"
                              onerror="this.style.display='none'">` : 
                        '<div class="no-thumbnail">-</div>'
                    }
                </td>
                <td class="product-name">
                    <div class="product-name-wrap">
                        <strong>${productName}</strong>
                        ${variety !== '-' ? `<span class="variety">${variety}</span>` : ''}
                    </div>
                </td>
                <td class="option-name">${optionName}</td>
                <td class="text-center origin">${origin}</td>
                <td class="text-right price">
                    <strong>${price}</strong>원
                </td>
                <td class="text-center">
                    <span class="status-badge ${statusBadgeClass}">
                        ${status}
                    </span>
                </td>
                <td class="text-center next-date">${nextDate}</td>
                <td class="text-center">
                    <div class="badges">
                        ${isFree ? '<span class="badge badge-free">무료</span>' : ''}
                        ${hasDetail ? '<span class="badge badge-detail">상세</span>' : ''}
                        ${hasImage ? '<span class="badge badge-image">이미지</span>' : ''}
                    </div>
                </td>
                <td class="text-center">
                    <div class="action-buttons">
                        <button class="btn-sm btn-primary quick-order-btn" 
                                data-product-id="${product.상품코드}">
                            빠른주문
                        </button>
                        ${product.옵션코드 ? 
                            `<button class="btn-sm btn-secondary chart-btn"
                                     data-code="${product.옵션코드}"
                                     data-name="${this.escapeHtml(product.옵션명)}">
                                차트
                            </button>` : ''
                        }
                    </div>
                </td>
            </tr>
        `;
    }
    
    /**
     * 데이터 없음 표시
     */
    showNoData() {
        this.container.innerHTML = `
            <tr>
                <td colspan="10" class="no-data-cell">
                    <div class="no-data-icon">📦</div>
                    <div class="no-data-message">
                        검색 결과가 없습니다.<br>
                        다른 검색어나 필터를 사용해 보세요.
                    </div>
                </td>
            </tr>
        `;
    }
    
    /**
     * 공급상태 가져오기
     */
    getSupplyStatus(product) {
        return product.원물공급상태 || product.공급상태 || '미정';
    }
    
    /**
     * 상태별 행 클래스
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
     * 상태 배지 클래스
     */
    getStatusBadgeClass(status) {
        const badgeMap = {
            '공급중': 'badge-success',
            '출하준비중': 'badge-info',
            '잠시만요': 'badge-warning',
            '시즌종료': 'badge-secondary',
            '공급중지': 'badge-danger'
        };
        return badgeMap[status] || 'badge-default';
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
     * 날짜 포맷팅
     */
    formatDate(dateStr) {
        if (!dateStr) return '-';
        
        // MM-DD 형식이면 그대로 반환
        if (dateStr.length === 5 && dateStr.indexOf('-') === 2) {
            return dateStr;
        }
        
        // Date 객체로 변환
        const date = new Date(dateStr);
        if (isNaN(date)) return '-';
        
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${month}-${day}`;
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
     * 툴팁 초기화
     */
    initTooltips() {
        // 툴팁이 필요한 요소들에 대한 이벤트 설정
        document.querySelectorAll('.product-name').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const text = e.currentTarget.textContent.trim();
                if (text.length > 20) {
                    // 툴팁 표시 로직
                    this.showTooltip(e, text);
                }
            });
            
            el.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }
    
    /**
     * 툴팁 표시
     */
    showTooltip(event, text) {
        // 툴팁 구현 (필요시 별도 모듈로 분리)
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${event.pageX}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
        document.body.appendChild(tooltip);
    }
    
    /**
     * 툴팁 숨기기
     */
    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
}