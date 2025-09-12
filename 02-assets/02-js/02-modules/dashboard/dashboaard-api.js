/**
 * dashboard-api.js
 * 대시보드 API 통신 모듈
 */

export class DashboardAPI {
    constructor() {
        this.baseUrl = '/api';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5분
    }
    
    /**
     * 상품 데이터 가져오기
     */
    async fetchProducts() {
        const cacheKey = 'products';
        
        // 캐시 확인
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 미공급상품 필터링
            const filteredData = data.filter(product => {
                const supplyStatus = product['셀러공급Y/N'] || '';
                return supplyStatus.toString().trim() !== '미공급상품';
            });
            
            // 캐시 저장
            this.setCache(cacheKey, filteredData);
            
            return filteredData;
            
        } catch (error) {
            console.error('상품 데이터 로드 실패:', error);
            
            // 캐시된 데이터가 있으면 반환
            const cached = this.cache.get(cacheKey);
            if (cached) {
                console.log('만료된 캐시 데이터 사용');
                return cached.data;
            }
            
            throw error;
        }
    }
    
    /**
     * 상품 옵션 가져오기
     */
    async fetchProductOptions(productName) {
        const cacheKey = `options_${productName}`;
        
        // 캐시 확인
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }
        
        try {
            // 전체 상품 데이터에서 필터링
            const allProducts = await this.fetchProducts();
            const options = allProducts.filter(p => p.상품명 === productName);
            
            // 캐시 저장
            this.setCache(cacheKey, options);
            
            return options;
            
        } catch (error) {
            console.error('옵션 데이터 로드 실패:', error);
            return [];
        }
    }
    
    /**
     * 가격 이력 데이터 가져오기
     */
    async fetchPriceHistory(optionCode) {
        const cacheKey = `price_${optionCode}`;
        
        // 캐시 확인
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/price-history?optionCode=${optionCode}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 날짜순 정렬
            data.sort((a, b) => new Date(a.날짜) - new Date(b.날짜));
            
            // 캐시 저장
            this.setCache(cacheKey, data);
            
            return data;
            
        } catch (error) {
            console.error('가격 이력 로드 실패:', error);
            return [];
        }
    }
    
    /**
     * 캐시 유효성 확인
     */
    isCacheValid(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < this.cacheTimeout;
    }
    
    /**
     * 캐시 저장
     */
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    /**
     * 캐시 초기화
     */
    clearCache() {
        this.cache.clear();
    }
}