/**
 * products-pagination.js
 * 페이지네이션 모듈
 */

export class ProductsPagination {
    constructor() {
        this.container = document.getElementById('pagination');
    }
    
    /**
     * 페이지네이션 렌더링
     */
    render(options) {
        if (!this.container) return;
        
        const {
            currentPage,
            totalPages,
            totalItems,
            onPageChange
        } = options;
        
        // 페이지가 1개 이하면 페이지네이션 숨김
        if (totalPages <= 1) {
            this.container.innerHTML = '';
            return;
        }
        
        // 페이지 번호 계산
        const pageNumbers = this.calculatePageNumbers(currentPage, totalPages);
        
        // HTML 생성
        let html = '<div class="pagination-wrapper">';
        
        // 이전 페이지 버튼
        html += this.createPrevButton(currentPage, onPageChange);
        
        // 페이지 번호들
        html += '<div class="page-numbers">';
        pageNumbers.forEach(pageNum => {
            html += this.createPageButton(pageNum, currentPage, totalPages, onPageChange);
        });
        html += '</div>';
        
        // 다음 페이지 버튼
        html += this.createNextButton(currentPage, totalPages, onPageChange);
        
        // 페이지 정보
        html += this.createPageInfo(currentPage, totalPages, totalItems);
        
        html += '</div>';
        
        this.container.innerHTML = html;
        
        // 이벤트 리스너 연결
        this.attachEventListeners(onPageChange);
    }
    
    /**
     * 표시할 페이지 번호 계산
     */
    calculatePageNumbers(currentPage, totalPages) {
        const maxVisible = 10; // 최대 표시 페이지 수
        const pageNumbers = [];
        
        if (totalPages <= maxVisible) {
            // 전체 페이지가 maxVisible 이하면 모두 표시
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // 현재 페이지 중심으로 표시
            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages, start + maxVisible - 1);
            
            // 시작 위치 조정
            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }
            
            // 첫 페이지
            if (start > 1) {
                pageNumbers.push(1);
                if (start > 2) {
                    pageNumbers.push('...');
                }
            }
            
            // 중간 페이지들
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
            
            // 마지막 페이지
            if (end < totalPages) {
                if (end < totalPages - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    }
    
    /**
     * 이전 버튼 생성
     */
    createPrevButton(currentPage, onPageChange) {
        const disabled = currentPage === 1 ? 'disabled' : '';
        return `
            <button class="page-btn page-prev ${disabled}" 
                    data-page="${currentPage - 1}"
                    ${disabled}>
                <span>‹</span>
                <span class="page-btn-text">이전</span>
            </button>
        `;
    }
    
    /**
     * 다음 버튼 생성
     */
    createNextButton(currentPage, totalPages, onPageChange) {
        const disabled = currentPage === totalPages ? 'disabled' : '';
        return `
            <button class="page-btn page-next ${disabled}" 
                    data-page="${currentPage + 1}"
                    ${disabled}>
                <span class="page-btn-text">다음</span>
                <span>›</span>
            </button>
        `;
    }
    
    /**
     * 페이지 번호 버튼 생성
     */
    createPageButton(pageNum, currentPage, totalPages, onPageChange) {
        if (pageNum === '...') {
            return '<span class="page-ellipsis">...</span>';
        }
        
        const active = pageNum === currentPage ? 'active' : '';
        return `
            <button class="page-btn page-number ${active}" 
                    data-page="${pageNum}">
                ${pageNum}
            </button>
        `;
    }
    
    /**
     * 페이지 정보 생성
     */
    createPageInfo(currentPage, totalPages, totalItems) {
        return `
            <div class="page-info">
                <span class="current-page">${currentPage}</span>
                <span class="separator">/</span>
                <span class="total-pages">${totalPages}</span>
                <span class="page-label">페이지</span>
                <span class="total-items">(총 ${totalItems}개)</span>
            </div>
        `;
    }
    
    /**
     * 이벤트 리스너 연결
     */
    attachEventListeners(onPageChange) {
        this.container.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.currentTarget.dataset.page);
                if (page && onPageChange) {
                    onPageChange(page);
                }
            });
        });
    }
    
    /**
     * 빠른 페이지 이동
     */
    createQuickJump(currentPage, totalPages, onPageChange) {
        return `
            <div class="quick-jump">
                <input type="number" 
                       class="page-input" 
                       min="1" 
                       max="${totalPages}" 
                       value="${currentPage}"
                       placeholder="페이지">
                <button class="btn-jump">이동</button>
            </div>
        `;
    }
    
    /**
     * 페이지당 아이템 수 선택
     */
    createItemsPerPage(currentValue, options, onChange) {
        let html = `
            <div class="items-per-page">
                <label>표시 개수:</label>
                <select class="items-select">
        `;
        
        options.forEach(option => {
            const selected = option === currentValue ? 'selected' : '';
            html += `<option value="${option}" ${selected}>${option}개</option>`;
        });
        
        html += `
                </select>
            </div>
        `;
        
        return html;
    }
    
    /**
     * 모바일용 간단한 페이지네이션
     */
    renderMobile(options) {
        if (!this.container) return;
        
        const { currentPage, totalPages, onPageChange } = options;
        
        let html = '<div class="pagination-mobile">';
        
        // 이전 버튼
        if (currentPage > 1) {
            html += `
                <button class="page-btn-mobile prev" data-page="${currentPage - 1}">
                    ‹ 이전
                </button>
            `;
        }
        
        // 페이지 정보
        html += `
            <div class="page-info-mobile">
                ${currentPage} / ${totalPages}
            </div>
        `;
        
        // 다음 버튼
        if (currentPage < totalPages) {
            html += `
                <button class="page-btn-mobile next" data-page="${currentPage + 1}">
                    다음 ›
                </button>
            `;
        }
        
        html += '</div>';
        
        this.container.innerHTML = html;
        
        // 이벤트 리스너
        this.container.querySelectorAll('.page-btn-mobile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.currentTarget.dataset.page);
                if (page && onPageChange) {
                    onPageChange(page);
                }
            });
        });
    }
}