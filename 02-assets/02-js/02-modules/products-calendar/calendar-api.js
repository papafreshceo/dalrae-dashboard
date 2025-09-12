/**
 * calendar-api.js
 * 캘린더 API 통신 모듈
 */

export class CalendarAPI {
    constructor() {
        this.baseUrl = '/api';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5분
    }
    
    /**
     * 상품 데이터 가져오기
     */
    async fetchProducts() {
        const cacheKey = 'calendar_products';
        
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
            
            // 캘린더용 데이터 처리
            const processedData = this.processProductsForCalendar(data);
            
            // 캐시 저장
            this.setCache(cacheKey, processedData);
            
            return processedData;
            
        } catch (error) {
            console.error('상품 데이터 로드 실패:', error);
            
            // 캐시된 데이터가 있으면 반환
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached.data;
            }
            
            throw error;
        }
    }
    
    /**
     * 캘린더용 상품 데이터 처리
     */
    processProductsForCalendar(data) {
        return data
            .filter(product => {
                // 시즌 정보가 있는 상품만
                return product.시즌시작 || product.시즌종료;
            })
            .map(product => {
                // 공급상태 통합
                product.공급상태_통합 = product.원물공급상태 || product.공급상태 || '';
                
                // 시즌 날짜 파싱
                if (product.시즌시작) {
                    product.시즌시작_날짜 = this.parseSeasonDate(product.시즌시작);
                }
                
                if (product.시즌종료) {
                    product.시즌종료_날짜 = this.parseSeasonDate(product.시즌종료);
                }
                
                // 시즌 기간 계산 (일수)
                if (product.시즌시작_날짜 && product.시즌종료_날짜) {
                    const diff = product.시즌종료_날짜 - product.시즌시작_날짜;
                    product.시즌기간 = Math.ceil(diff / (1000 * 60 * 60 * 24));
                }
                
                return product;
            });
    }
    
    /**
     * 가격 이력 데이터 가져오기
     */
    async fetchPriceHistory(optionCode) {
        const cacheKey = `price_history_${optionCode}`;
        
        // 캐시 확인
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }
        
        try {
            const response = await fetch(
                `${this.baseUrl}/price-history?optionCode=${optionCode}`
            );
            
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
     * 품종별 상품 가져오기
     */
    async fetchProductsByVariety(variety) {
        const products = await this.fetchProducts();
        return products.filter(p => p.품종 === variety);
    }
    
    /**
     * 날짜별 상품 가져오기
     */
    async fetchProductsByDate(date) {
        const products = await this.fetchProducts();
        
        return products.filter(product => {
            if (!product.시즌시작_날짜 || !product.시즌종료_날짜) {
                return false;
            }
            
            return date >= product.시즌시작_날짜 && date <= product.시즌종료_날짜;
        });
    }
    
    /**
     * 월별 상품 가져오기
     */
    async fetchProductsByMonth(year, month) {
        const products = await this.fetchProducts();
        
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        return products.filter(product => {
            if (!product.시즌시작_날짜 || !product.시즌종료_날짜) {
                return false;
            }
            
            // 시즌이 해당 월과 겹치는지 확인
            return !(product.시즌종료_날짜 < startDate || product.시즌시작_날짜 > endDate);
        });
    }
    
    /**
     * 시즌 날짜 파싱
     */
    parseSeasonDate(dateStr) {
        if (!dateStr) return null;
        
        // MM-DD 형식
        if (dateStr.length === 5 && dateStr.indexOf('-') === 2) {
            const currentYear = new Date().getFullYear();
            const month = parseInt(dateStr.slice(0, 2)) - 1;
            const day = parseInt(dateStr.slice(3, 5));
            
            return new Date(currentYear, month, day);
        }
        
        // MM/DD 형식
        if (dateStr.length === 5 && dateStr.indexOf('/') === 2) {
            const currentYear = new Date().getFullYear();
            const month = parseInt(dateStr.slice(0, 2)) - 1;
            const day = parseInt(dateStr.slice(3, 5));
            
            return new Date(currentYear, month, day);
        }
        
        // YYYY-MM-DD 형식
        return new Date(dateStr);
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