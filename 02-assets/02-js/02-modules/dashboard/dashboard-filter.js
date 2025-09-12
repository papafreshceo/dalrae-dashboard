/**
 * dashboard-filter.js
 * 대시보드 필터링 모듈
 */

export class DashboardFilter {
    constructor() {
        this.filterContent = document.getElementById('filterContent');
        this.filterToggle = document.getElementById('filterToggle');
    }
    
    /**
     * 필터 섹션 토글
     */
    toggleFilter() {
        if (!this.filterContent || !this.filterToggle) return;
        
        const isCollapsed = this.filterContent.classList.contains('collapsed');
        
        this.filterContent.classList.toggle('collapsed');
        this.filterToggle.classList.toggle('collapsed', !isCollapsed);
        this.filterToggle.textContent = isCollapsed ? '필터 숨기기' : '필터 보기';
    }
    
    /**
     * 필터 적용
     */
    applyFilters(products, filters) {
        let filtered = [...products];
        
        // 상태 필터
        if (filters.status && filters.status !== 'all') {
            filtered = this.filterByStatus(filtered, filters.status);
        }
        
        // 품목 필터
        if (filters.type && filters.type !== 'all') {
            filtered = this.filterByType(filtered, filters.type);
        }
        
        // 상품 필터
        if (filters.product && filters.product !== 'all') {
            filtered = this.filterByProduct(filtered, filters.product);
        }
        
        return filtered;
    }
    
    /**
     * 상태별 필터링
     */
    filterByStatus(products, status) {
        const statusMap = {
            'active': '공급중',
            'preparing': '출하준비중',
            'warning': '잠시만요',
            'paused': '시즌종료',
            'stopped': '공급중지'
        };
        
        const targetStatus = statusMap[status];
        if (!targetStatus) return products;
        
        return products.filter(product => {
            const productStatus = this.getSupplyStatus(product);
            return productStatus === targetStatus;
        });
    }
    
    /**
     * 품목별 필터링
     */
    filterByType(products, type) {
        const typeMap = {
            'agricultural': ['채소', '과일', '곡물', '농산물'],
            'seafood': ['수산물', '해산물', '생선'],
            'livestock': ['축산물', '육류', '계란'],
            'imported': ['수입농산물', '수입과일', '수입채소'],
            'processed': ['가공품', '가공식품']
        };
        
        const validTypes = typeMap[type];
        if (!validTypes) return products;
        
        return products.filter(product => {
            const productType = product.품목 || '';
            return validTypes.some(t => productType.includes(t));
        });
    }
    
    /**
     * 상품명 필터링
     */
    filterByProduct(products, productName) {
        if (productName === 'all') return products;
        
        return products.filter(product => {
            return product.상품명 === productName;
        });
    }
    
    /**
     * 검색 필터링
     */
    filterBySearch(products, searchTerm) {
        if (!searchTerm) return products;
        
        const term = searchTerm.toLowerCase();
        
        return products.filter(product => {
            const searchableFields = [
                product.상품명,
                product.품종,
                product.옵션명,
                product.품목,
                product.원산지
            ].filter(Boolean).join(' ').toLowerCase();
            
            return searchableFields.includes(term);
        });
    }
    
    /**
     * 공급상태 가져오기
     */
    getSupplyStatus(product) {
        return product.원물공급상태 || product.공급상태 || '';
    }
    
    /**
     * 고유 값 추출
     */
    getUniqueValues(products, field) {
        const values = new Set();
        
        products.forEach(product => {
            const value = product[field];
            if (value) {
                values.add(value);
            }
        });
        
        return Array.from(values).sort();
    }
    
    /**
     * 필터 옵션 생성
     */
    generateFilterOptions(products) {
        return {
            types: this.getUniqueValues(products, '품목'),
            products: this.getUniqueValues(products, '상품명'),
            varieties: this.getUniqueValues(products, '품종')
        };
    }
}