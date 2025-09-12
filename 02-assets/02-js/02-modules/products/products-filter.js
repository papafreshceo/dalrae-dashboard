/**
 * products-filter.js
 * 상품 필터링 모듈
 */

export class ProductsFilter {
    constructor() {
        this.filterContainer = document.querySelector('.filter-tags');
    }
    
    /**
     * 필터 적용
     */
    applyFilter(products, filterType) {
        switch (filterType) {
            case 'all':
                return products;
                
            case 'agricultural':
                return this.filterByCategory(products, ['농산물', '채소', '과일', '곡물']);
                
            case 'seafood':
                return this.filterByCategory(products, ['수산물', '해산물', '생선']);
                
            case 'livestock':
                return this.filterByCategory(products, ['축산물', '육류', '계란', '유제품']);
                
            case 'imported':
                return this.filterByCategory(products, ['수입농산물', '수입과일', '수입채소']);
                
            case 'active':
                return this.filterByStatus(products, '공급중');
                
            case 'preparing':
                return this.filterByStatus(products, '출하준비중');
                
            case 'paused':
                return this.filterByStatus(products, '시즌종료');
                
            case 'stopped':
                return this.filterByStatus(products, '공급중지');
                
            default:
                return products;
        }
    }
    
    /**
     * 카테고리별 필터링
     */
    filterByCategory(products, categories) {
        return products.filter(product => {
            const productCategory = product.품목 || '';
            return categories.some(category => 
                productCategory.includes(category)
            );
        });
    }
    
    /**
     * 상태별 필터링
     */
    filterByStatus(products, status) {
        return products.filter(product => {
            const productStatus = product.원물공급상태 || product.공급상태 || '';
            return productStatus === status;
        });
    }
    
    /**
     * 다중 필터 적용
     */
    applyMultipleFilters(products, filters) {
        let filtered = [...products];
        
        // 카테고리 필터
        if (filters.category && filters.category !== 'all') {
            filtered = this.applyFilter(filtered, filters.category);
        }
        
        // 상태 필터
        if (filters.status && filters.status !== 'all') {
            filtered = this.filterByStatus(filtered, filters.status);
        }
        
        // 무료배송 필터
        if (filters.freeShipping) {
            filtered = filtered.filter(p => p.무료배송 === 'O');
        }
        
        // 이미지 있는 상품만
        if (filters.hasImage) {
            filtered = filtered.filter(p => p.이미지 === 'O');
        }
        
        // 가격 범위 필터
        if (filters.priceMin || filters.priceMax) {
            filtered = this.filterByPriceRange(
                filtered, 
                filters.priceMin, 
                filters.priceMax
            );
        }
        
        return filtered;
    }
    
    /**
     * 가격 범위 필터링
     */
    filterByPriceRange(products, minPrice, maxPrice) {
        return products.filter(product => {
            const price = parseInt(String(product.공급가 || 0).replace(/,/g, ''));
            
            if (minPrice && price < minPrice) return false;
            if (maxPrice && price > maxPrice) return false;
            
            return true;
        });
    }
    
    /**
     * 필터 태그 생성
     */
    generateFilterTags(products) {
        if (!this.filterContainer) return;
        
        // 카테고리별 상품 수 계산
        const categoryCounts = this.calculateCategoryCounts(products);
        const statusCounts = this.calculateStatusCounts(products);
        
        // 동적 필터 태그 추가
        this.addDynamicFilters(categoryCounts, statusCounts);
    }
    
    /**
     * 카테고리별 상품 수 계산
     */
    calculateCategoryCounts(products) {
        const counts = {};
        
        products.forEach(product => {
            const category = product.품목 || '기타';
            counts[category] = (counts[category] || 0) + 1;
        });
        
        return counts;
    }
    
    /**
     * 상태별 상품 수 계산
     */
    calculateStatusCounts(products) {
        const counts = {};
        
        products.forEach(product => {
            const status = product.원물공급상태 || product.공급상태 || '미정';
            counts[status] = (counts[status] || 0) + 1;
        });
        
        return counts;
    }
    
    /**
     * 동적 필터 추가
     */
    addDynamicFilters(categoryCounts, statusCounts) {
        // 카테고리가 많은 경우 추가 필터 생성
        const dynamicFilters = [];
        
        // 5개 이상의 상품이 있는 카테고리만 표시
        Object.entries(categoryCounts).forEach(([category, count]) => {
            if (count >= 5 && !this.isDefaultCategory(category)) {
                dynamicFilters.push({
                    type: 'category',
                    value: category,
                    label: `${category} (${count})`,
                    count: count
                });
            }
        });
        
        // 동적 필터를 UI에 추가하는 로직
        this.renderDynamicFilters(dynamicFilters);
    }
    
    /**
     * 기본 카테고리 확인
     */
    isDefaultCategory(category) {
        const defaults = ['농산물', '수산물', '축산물', '수입농산물'];
        return defaults.some(d => category.includes(d));
    }
    
    /**
     * 동적 필터 렌더링
     */
    renderDynamicFilters(filters) {
        const dynamicContainer = document.getElementById('dynamicFilters');
        if (!dynamicContainer) return;
        
        let html = '';
        
        filters.forEach(filter => {
            html += `
                <span class="filter-tag dynamic" 
                      data-filter="${filter.value}">
                    ${filter.label}
                </span>
            `;
        });
        
        dynamicContainer.innerHTML = html;
    }
    
    /**
     * 필터 상태 초기화
     */
    resetFilters() {
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        
        // 전체 필터 활성화
        const allFilter = document.querySelector('.filter-tag[data-filter="all"]');
        if (allFilter) {
            allFilter.classList.add('active');
        }
    }
    
    /**
     * 현재 활성 필터 가져오기
     */
    getActiveFilters() {
        const activeFilters = [];
        
        document.querySelectorAll('.filter-tag.active').forEach(tag => {
            activeFilters.push(tag.dataset.filter);
        });
        
        return activeFilters;
    }
}