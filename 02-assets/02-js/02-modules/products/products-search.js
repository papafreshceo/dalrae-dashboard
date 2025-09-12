/**
 * products-search.js
 * 상품 검색 모듈
 */

export class ProductsSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchHistory = this.loadSearchHistory();
    }
    
    /**
     * 상품 검색
     */
    searchProducts(products, searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return products;
        }
        
        const term = searchTerm.toLowerCase().trim();
        
        // 검색 히스토리에 추가
        this.addToHistory(term);
        
        // 검색 실행
        return products.filter(product => {
            return this.matchProduct(product, term);
        });
    }
    
    /**
     * 상품 매칭 확인
     */
    matchProduct(product, term) {
        // 검색 대상 필드들
        const searchableFields = [
            product.상품명,
            product.품종,
            product.옵션명,
            product.품목,
            product.원산지,
            product.규격1,
            product.규격2,
            product.규격3,
            product.출하단위
        ];
        
        // 모든 필드를 합쳐서 검색
        const searchText = searchableFields
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        
        // 검색어가 포함되어 있는지 확인
        if (searchText.includes(term)) {
            return true;
        }
        
        // 개별 단어로 분리하여 검색
        const words = term.split(' ').filter(Boolean);
        return words.every(word => searchText.includes(word));
    }
    
    /**
     * 고급 검색
     */
    advancedSearch(products, criteria) {
        let results = [...products];
        
        // 상품명 검색
        if (criteria.productName) {
            results = results.filter(p => 
                p.상품명 && p.상품명.toLowerCase().includes(criteria.productName.toLowerCase())
            );
        }
        
        // 품종 검색
        if (criteria.variety) {
            results = results.filter(p => 
                p.품종 && p.품종.toLowerCase().includes(criteria.variety.toLowerCase())
            );
        }
        
        // 원산지 검색
        if (criteria.origin) {
            results = results.filter(p => 
                p.원산지 && p.원산지.toLowerCase().includes(criteria.origin.toLowerCase())
            );
        }
        
        // 가격 범위 검색
        if (criteria.minPrice || criteria.maxPrice) {
            results = this.filterByPrice(results, criteria.minPrice, criteria.maxPrice);
        }
        
        // 공급상태 검색
        if (criteria.status && criteria.status !== 'all') {
            results = results.filter(p => {
                const status = p.원물공급상태 || p.공급상태 || '';
                return status === criteria.status;
            });
        }
        
        // 무료배송 여부
        if (criteria.freeShipping !== undefined) {
            results = results.filter(p => 
                criteria.freeShipping ? p.무료배송 === 'O' : p.무료배송 !== 'O'
            );
        }
        
        return results;
    }
    
    /**
     * 가격 범위 필터
     */
    filterByPrice(products, minPrice, maxPrice) {
        return products.filter(product => {
            const price = parseInt(String(product.공급가 || 0).replace(/,/g, ''));
            
            if (minPrice && price < parseInt(minPrice)) return false;
            if (maxPrice && price > parseInt(maxPrice)) return false;
            
            return true;
        });
    }
    
    /**
     * 검색어 자동완성
     */
    getAutocompleteSuggestions(products, term) {
        if (!term || term.length < 2) {
            return [];
        }
        
        const suggestions = new Set();
        const lowerTerm = term.toLowerCase();
        
        products.forEach(product => {
            // 상품명에서 추출
            if (product.상품명 && product.상품명.toLowerCase().includes(lowerTerm)) {
                suggestions.add(product.상품명);
            }
            
            // 품종에서 추출
            if (product.품종 && product.품종.toLowerCase().includes(lowerTerm)) {
                suggestions.add(product.품종);
            }
            
            // 옵션명에서 추출
            if (product.옵션명 && product.옵션명.toLowerCase().includes(lowerTerm)) {
                suggestions.add(product.옵션명);
            }
        });
        
        // 배열로 변환하고 정렬
        return Array.from(suggestions)
            .filter(s => s.toLowerCase().startsWith(lowerTerm))
            .sort()
            .slice(0, 10); // 최대 10개
    }
    
    /**
     * 검색 히스토리 추가
     */
    addToHistory(term) {
        if (!term || term.length < 2) return;
        
        // 중복 제거
        this.searchHistory = this.searchHistory.filter(h => h !== term);
        
        // 최신 검색어를 앞에 추가
        this.searchHistory.unshift(term);
        
        // 최대 10개까지만 저장
        if (this.searchHistory.length > 10) {
            this.searchHistory = this.searchHistory.slice(0, 10);
        }
        
        // 로컬 스토리지에 저장
        this.saveSearchHistory();
    }
    
    /**
     * 검색 히스토리 로드
     */
    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('productSearchHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('검색 히스토리 로드 실패:', error);
            return [];
        }
    }
    
    /**
     * 검색 히스토리 저장
     */
    saveSearchHistory() {
        try {
            localStorage.setItem('productSearchHistory', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('검색 히스토리 저장 실패:', error);
        }
    }
    
    /**
     * 검색 히스토리 초기화
     */
    clearHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
    }
    
    /**
     * 검색 하이라이트
     */
    highlightSearchTerm(text, term) {
        if (!term) return text;
        
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    /**
     * 검색 통계
     */
    getSearchStats(originalProducts, filteredProducts) {
        return {
            total: originalProducts.length,
            found: filteredProducts.length,
            percentage: Math.round((filteredProducts.length / originalProducts.length) * 100)
        };
    }
}