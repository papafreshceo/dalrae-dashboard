/**
 * 데이터 서비스 레이어
 * 모든 데이터 통신을 중앙화하여 나중에 Firebase 전환시 이 파일만 수정
 */
class DataService {
    // 데이터 소스 설정 (google 또는 firebase)
    static source = 'google';
    
    // 캐시 저장소
    static cache = {
        products: null,
        priceHistory: {},
        lastFetch: null
    };
    
    // 캐시 유효 시간 (5분)
    static CACHE_DURATION = 5 * 60 * 1000;
    
    /**
     * 상품 데이터 가져오기
     */
    static async getProducts(forceRefresh = false) {
        const now = Date.now();
        
        // 캐시 확인
        if (!forceRefresh && 
            this.cache.products && 
            this.cache.lastFetch && 
            (now - this.cache.lastFetch < this.CACHE_DURATION)) {
            return this.cache.products;
        }
        
        try {
            if (this.source === 'google') {
                // 구글시트에서 데이터 가져오기
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // 미공급상품 필터링
                const filteredData = data.filter(p => {
                    const supplyStatus = p['셀러공급Y/N'] || '';
                    return supplyStatus.toString().trim() !== '미공급상품';
                });
                
                // 캐시 저장
                this.cache.products = filteredData;
                this.cache.lastFetch = now;
                
                return filteredData;
                
            } else if (this.source === 'firebase') {
                // Firebase에서 데이터 가져오기 (나중에 구현)
                // const snapshot = await firebase.firestore()
                //     .collection('products')
                //     .where('status', '!=', '미공급상품')
                //     .get();
                // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            // 캐시된 데이터가 있으면 반환
            if (this.cache.products) {
                console.log('캐시된 데이터 사용');
                return this.cache.products;
            }
            throw error;
        }
    }
    
    /**
     * 가격 이력 데이터 가져오기
     */
    static async getPriceHistory(optionCode) {
        // 캐시 확인
        if (this.cache.priceHistory[optionCode]) {
            return this.cache.priceHistory[optionCode];
        }
        
        try {
            if (this.source === 'google') {
                const response = await fetch(`/api/price-history?optionCode=${optionCode}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // 캐시 저장
                this.cache.priceHistory[optionCode] = data;
                
                return data;
                
            } else if (this.source === 'firebase') {
                // Firebase 구현 (나중에)
                // const snapshot = await firebase.firestore()
                //     .collection('priceHistory')
                //     .where('optionCode', '==', optionCode)
                //     .orderBy('date', 'desc')
                //     .get();
                // return snapshot.docs.map(doc => doc.data());
            }
        } catch (error) {
            console.error('가격 이력 로드 실패:', error);
            return [];
        }
    }
    
    /**
     * 특정 품종의 상품들 가져오기
     */
    static async getProductsByVariety(variety) {
        const allProducts = await this.getProducts();
        return allProducts.filter(p => (p.품종 || p.품목) === variety);
    }
    
    /**
     * 날짜별 이벤트 처리
     */
    static async getMonthEvents(year, month) {
        const products = await this.getProducts();
        const events = {};
        
        products.forEach(p => {
            const variety = p.품종 || p.품목;
            if (!variety) return;
            
            const startStr = p.시작일;
            const endStr = p.종료일;
            
            // 시작일 처리
            if (startStr) {
                const startMonth = parseInt(startStr.substring(0, 2)) - 1;
                const startDay = parseInt(startStr.substring(3, 5));
                
                if (startMonth === month) {
                    const key = `${year}-${month}-${startDay}`;
                    if (!events[key]) events[key] = { starts: [], ends: [] };
                    events[key].starts.push({
                        variety,
                        color: p.색코드 || null,
                        product: p
                    });
                }
            }
            
            // 종료일 처리
            if (endStr) {
                const endMonth = parseInt(endStr.substring(0, 2)) - 1;
                const endDay = parseInt(endStr.substring(3, 5));
                
                if (endMonth === month) {
                    const key = `${year}-${month}-${endDay}`;
                    if (!events[key]) events[key] = { starts: [], ends: [] };
                    events[key].ends.push({
                        variety,
                        color: p.색코드 || null,
                        product: p
                    });
                }
            }
        });
        
        return events;
    }
    
    /**
     * 연간 타임라인 데이터 생성
     */
    static async getYearTimelines() {
        const products = await this.getProducts();
        const yearMap = {};
        
        products.forEach(p => {
            const variety = p.품종 || p.품목;
            const item = p.품목;
            if (!variety) return;
            
            const startStr = p.시작일;
            const endStr = p.종료일;
            
            if (!startStr || !endStr) return;
            
            const startMonth = parseInt(startStr.substring(0, 2)) - 1;
            const startDay = parseInt(startStr.substring(3, 5));
            const endMonth = parseInt(endStr.substring(0, 2)) - 1;
            const endDay = parseInt(endStr.substring(3, 5));
            
            if (!yearMap[variety]) {
                yearMap[variety] = {
                    name: variety,
                    item: item,
                    color: p.색코드 || null,
                    startMonth: startMonth,
                    startDay: startDay,
                    endMonth: endMonth,
                    endDay: endDay,
                    status: p.원물공급상태 || p.공급상태,
                    options: []
                };
            }
            
            yearMap[variety].options.push({
                name: p.옵션명,
                variety: p.품종,
                status: p.원물공급상태 || p.공급상태,
                price: p.셀러공급가,
                code: p.옵션코드
            });
        });
        
        // 시작일 기준으로 정렬
        return Object.values(yearMap).sort((a, b) => {
            const aDate = a.startMonth * 100 + a.startDay;
            const bDate = b.startMonth * 100 + b.startDay;
            return aDate - bDate;
        });
    }
    
    /**
     * 색상 팔레트 가져오기 (색코드가 없는 경우 사용)
     */
    static getDefaultColor(index) {
        const palette = [
            '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea',
            '#0891b2', '#be123c', '#15803d', '#a16207', '#7c2d12',
            '#0f766e', '#be185d', '#166534', '#a21caf', '#b91c1c'
        ];
        return palette[index % palette.length];
    }
    
    /**
     * 캐시 초기화
     */
    static clearCache() {
        this.cache = {
            products: null,
            priceHistory: {},
            lastFetch: null
        };
    }
    
    /**
     * Firebase로 전환 (나중에 사용)
     */
    static switchToFirebase() {
        this.source = 'firebase';
        this.clearCache();
    }
    
    /**
     * 구글시트로 전환
     */
    static switchToGoogle() {
        this.source = 'google';
        this.clearCache();
    }
}

// 전역으로 내보내기
window.DataService = DataService;
