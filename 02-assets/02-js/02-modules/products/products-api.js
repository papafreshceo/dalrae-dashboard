/**
 * products-api.js
 * 상품 리스트 API 통신 모듈
 */

export class ProductsAPI {
    constructor() {
        this.baseUrl = '/api';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5분
    }
    
    /**
     * 상품 목록 가져오기
     */
    async fetchProducts() {
        const cacheKey = 'products_list';
        
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
            
            // 데이터 정제
            const processedData = this.processProductData(data);
            
            // 캐시 저장
            this.setCache(cacheKey, processedData);
            
            return processedData;
            
        } catch (error) {
            console.error('상품 데이터 로드 실패:', error);
            
            // 캐시된 데이터가 있으면 반환
            const cached = this.cache.get(cacheKey);
            if (cached) {
                console.log('캐시된 데이터 사용');
                return cached.data;
            }
            
            throw error;
        }
    }
    
    /**
     * 상품 데이터 처리
     */
    processProductData(data) {
        return data
            .filter(product => {
                // 미공급상품 제외
                const supplyStatus = product['셀러공급Y/N'] || '';
                return supplyStatus.toString().trim() !== '미공급상품';
            })
            .map(product => {
                // 가격 파싱
                if (product.공급가) {
                    product.공급가_숫자 = parseInt(
                        String(product.공급가).replace(/,/g, '')
                    ) || 0;
                }
                
                // 날짜 파싱
                if (product.다음출하일) {
                    product.다음출하일_날짜 = this.parseDate(product.다음출하일);
                }
                
                // 공급상태 통합
                product.공급상태_통합 = product.원물공급상태 || product.공급상태 || '';
                
                return product;
            });
    }
    
    /**
     * 가격 이력 가져오기
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
     * 상품 상세 정보 가져오기
     */
    async fetchProductDetail(productCode) {
        const cacheKey = `product_detail_${productCode}`;
        
        // 캐시 확인
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }
        
        try {
            // 전체 상품에서 찾기
            const products = await this.fetchProducts();
            const product = products.find(p => p.상품코드 === productCode);
            
            if (product) {
                // 관련 옵션 찾기
                const options = products.filter(p => p.상품명 === product.상품명);
                product.옵션목록 = options;
                
                // 캐시 저장
                this.setCache(cacheKey, product);
            }
            
            return product;
            
        } catch (error) {
            console.error('상품 상세 로드 실패:', error);
            return null;
        }
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