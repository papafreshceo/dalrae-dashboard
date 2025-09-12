/**
 * dashboard-ui.js
 * 대시보드 UI 렌더링 모듈
 */

export class DashboardUI {
    constructor() {
        this.elements = {
            statsCards: document.getElementById('statsCards'),
            productsGrid: document.getElementById('productsGrid'),
            scoreboard: document.getElementById('filterMessage'),
            loadingOverlay: null
        };
    }
    
    /**
     * 로딩 표시
     */
    showLoading() {
        if (this.elements.productsGrid) {
            this.elements.productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <div style="color: #6c757d;">데이터를 불러오는 중...</div>
                </div>
            `;
        }
    }
    
    /**
     * 에러 표시
     */
    showError(message) {
        if (this.elements.productsGrid) {
            this.elements.productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <div style="color: #dc3545;">${message}</div>
                </div>
            `;
        }
    }
    
    /**
     * 통계 카드 업데이트
     */
    updateStatCards(stats) {
        const cards = this.elements.statsCards?.querySelectorAll('.stat-card');
        if (!cards) return;
        
        const values = [
            stats.total,
            stats.active,
            stats.preparing,
            stats.warning,
            stats.paused,
            stats.stopped
        ];
        
        cards.forEach((card, index) => {
            const valueEl = card.querySelector('.stat-value');
            if (valueEl) {
                valueEl.textContent = values[index] || '0';
            }
        });
    }
    
    /**
     * 활성 통계 카드 설정
     */
    setActiveStatCard(index) {
        const cards = this.elements.statsCards?.querySelectorAll('.stat-card');
        if (!cards) return;
        
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
    }
    
    /**
     * 스코어보드 업데이트
     */
    updateScoreboard(productCount, optionCount) {
        if (!this.elements.scoreboard) return;
        
        const productDigits = this.formatDigits(productCount);
        const optionDigits = this.formatDigits(optionCount);
        
        this.elements.scoreboard.innerHTML = `
            <div class="scoreboard-stats">
                <div class="scoreboard-item product">
                    <div class="scoreboard-label">상품</div>
                    <div class="scoreboard-digits">${productDigits}</div>
                </div>
                <div class="scoreboard-item option">
                    <div class="scoreboard-label">옵션</div>
                    <div class="scoreboard-digits">${optionDigits}</div>
                </div>
            </div>
        `;
    }
    
    /**
     * 숫자를 디지털 표시 형식으로 변환
     */
    formatDigits(number) {
        const digits = String(number).padStart(4, '0').split('');
        return digits.map(d => `<span class="digit">${d}</span>`).join('');
    }
    
    /**
     * 상품 그리드 렌더링
     */
    renderProductGrid(products) {
        if (!this.elements.productsGrid) return;
        
        if (products.length === 0) {
            this.elements.productsGrid.innerHTML = `
                <div class="no-data-message">
                    <div class="no-data-icon"></div>
                    <div class="no-data-title">상품이 없습니다</div>
                    <div class="no-data-text">필터를 변경해보세요</div>
                </div>
            `;
            return;
        }
        
        // 품목별 그룹화
        const grouped = this.groupProductsByType(products);
        let html = '';
        
        Object.entries(grouped).forEach(([type, items]) => {
            html += `
                <div class="group-divider"></div>
                <div class="group-title">${type} (${items.length})</div>
            `;
            
            items.forEach(product => {
                html += this.createProductCard(product);
            });
        });
        
        this.elements.productsGrid.innerHTML = html;
        
        // 이벤트 리스너 추가
        this.attachProductCardEvents();
    }
    
    /**
     * 품목별 그룹화
     */
    groupProductsByType(products) {
        const grouped = {};
        
        products.forEach(product => {
            const type = product.품목 || '기타';
            if (!grouped[type]) {
                grouped[type] = [];
            }
            grouped[type].push(product);
        });
        
        // 정렬
        return Object.keys(grouped)
            .sort()
            .reduce((obj, key) => {
                obj[key] = grouped[key];
                return obj;
            }, {});
    }
    
    /**
     * 상품 카드 생성
     */
    createProductCard(product) {
        const status = this.getSupplyStatus(product);
        const statusClass = this.getStatusClass(status);
        const statusBadgeClass = this.getStatusBadgeClass(status);
        
        const thumbnailUrl = product.썸네일 || '';
        const productName = product.상품명 || '상품명 없음';
        const variety = product.품종 || '';
        const optionName = product.옵션명 || '';
        const optionCount = product.옵션명 ? 1 : 0;
        const hasDetail = product.상세보기 === 'O';
        const hasImage = product.이미지 === 'O';
        const isFree = product.무료배송 === 'O';
        
        let nextDate = this.formatDate(this.parseDate(product.다음출하일));
        if (status === '공급중') {
            nextDate = '공급중';
        }
        
        return `
            <div class="product-card ${statusClass}" data-product-id="${product.상품코드}">
                <div class="product-content">
                    <div class="product-row1">
                        <div class="product-title">${productName}</div>
                        <div class="product-status-options">
                            <span class="status-badge ${statusBadgeClass}">${status}</span>
                            ${optionCount > 0 ? 
                                `<button class="option-badge" onclick="dashboard.showOptionsModal('${productName}')">
                                    옵션 ${optionCount}
                                </button>` : ''
                            }
                        </div>
                    </div>
                    
                    <div class="product-row2">
                        <span>${variety}</span>
                        ${optionName ? `<span class="separator">•</span><span>${optionName}</span>` : ''}
                    </div>
                    
                    <div class="product-divider"></div>
                    
                    <div class="product-footer">
                        <div class="next-date">${nextDate}</div>
                        <div class="product-badges">
                            ${isFree ? '<span class="badge-free">무료배송</span>' : ''}
                            ${hasDetail ? '<span class="badge-detail">상세</span>' : ''}
                            ${hasImage ? '<span class="badge-image">이미지</span>' : ''}
                        </div>
                    </div>
                </div>
                
                ${thumbnailUrl ? 
                    `<div class="product-thumbnail">
                        <img src="${thumbnailUrl}" alt="${productName}">
                    </div>` : 
                    `<div class="product-thumbnail empty"></div>`
                }
            </div>
        `;
    }
    
    /**
     * 공급상태 가져오기
     */
    getSupplyStatus(product) {
        return product.원물공급상태 || product.공급상태 || '';
    }
    
    /**
     * 상태별 클래스
     */
    getStatusClass(status) {
        const statusMap = {
            '공급중': 'status-active',
            '출하준비중': 'status-preparing',
            '잠시만요': 'status-warning',
            '시즌종료': 'status-paused',
            '공급중지': 'status-stopped'
        };
        return statusMap[status] || '';
    }
    
    /**
     * 상태 배지 클래스
     */
    getStatusBadgeClass(status) {
        const badgeMap = {
            '공급중': 'badge-active',
            '출하준비중': 'badge-preparing',
            '잠시만요': 'badge-warning',
            '시즌종료': 'badge-paused',
            '공급중지': 'badge-stopped'
        };
        return badgeMap[status] || '';
    }
    
    /**
     * 날짜 파싱
     */
    parseDate(dateStr) {
        if (!dateStr) return null;
        
        // MM-DD 형식
        if (dateStr.length === 5 && dateStr.indexOf('-') === 2) {
            const year = new Date().getFullYear();
            const month = parseInt(dateStr.slice(0, 2)) - 1;
            const day = parseInt(dateStr.slice(3, 5));
            
            let date = new Date(year, month, day);
            
            // 과거 날짜면 다음 해로
            if (date < new Date()) {
                date = new Date(year + 1, month, day);
            }
            
            return date;
        }
        
        return new Date(dateStr);
    }
    
    /**
     * 날짜 포맷팅
     */
    formatDate(date) {
        if (!date) return '-';
        
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${month}/${day}`;
    }
    
    /**
     * 상품 카드 이벤트 연결
     */
    attachProductCardEvents() {
        // 옵션 버튼 이벤트는 인라인으로 처리
        // 추가 이벤트가 필요한 경우 여기에 구현
    }
}