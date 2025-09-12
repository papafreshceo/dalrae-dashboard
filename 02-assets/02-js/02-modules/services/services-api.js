// ========== services-api.js ==========
export const ServicesAPI = {
    async fetchPrices() {
        try {
            console.log('서비스 가격 데이터 로딩 중...');
            this.showApiStatus('가격 데이터 로딩 중...', 'loading');
            
            const response = await fetch('/api/services');
            
            if (response.ok) {
                const data = await response.json();
                
                if (data && data.length > 0) {
                    console.log('Google Sheets 데이터 로드 성공:', data);
                    this.showApiStatus('가격 데이터 로드 완료', 'success');
                    return { priceConfig: this.parseServicePrices(data) };
                }
            }
            
            throw new Error('데이터 로드 실패');
        } catch (error) {
            console.error('API 오류:', error);
            this.showApiStatus('기본 가격으로 표시됩니다', 'error');
            return { priceConfig: this.getDefaultPriceConfig() };
        }
    },
    
    parseServicePrices(data) {
        const config = this.getDefaultPriceConfig();
        
        data.forEach(row => {
            const category = row.category;
            const type = row.type;
            const value = parseFloat(row.value) || 0;
            
            if (category === 'location') {
                if (config.locations[type]) {
                    Object.assign(config.locations[type], {
                        basePrice: value,
                        // 추가 필드들 파싱
                    });
                }
            } else if (category === 'farmService') {
                // 농가 서비스 파싱
            }
        });
        
        return config;
    },
    
    getDefaultPriceConfig() {
        return {
            locations: {
                indoor: {
                    basePrice: 30000,
                    basePhoto: 50,
                    baseVideo: 10,
                    photoAddCost: 500,
                    videoAddCost: 2000,
                    handCost: 30000,
                    modelCost: 200000,
                    sceneAddCost: 30000
                },
                outdoor: {
                    basePrice: 50000,
                    basePhoto: 50,
                    baseVideo: 5,
                    photoAddCost: 500,
                    videoAddCost: 2000,
                    handCost: 30000,
                    modelCost: 200000,
                    sceneAddCost: 50000
                },
                cooking: {
                    basePrice: 60000,
                    basePhoto: 30,
                    baseVideo: 3,
                    photoAddCost: 500,
                    videoAddCost: 2000,
                    menuCost: 30000,
                    handCost: 30000,
                    modelCost: 200000,
                    sceneAddCost: 60000
                },
                drone: {
                    basePrice: 90000,
                    basePhoto: 20,
                    baseVideo: 5,
                    photoAddCost: 500,
                    videoAddCost: 2000,
                    handCost: 0,
                    modelCost: 0,
                    sceneAddCost: 90000
                }
            },
            editing: {
                basic: { basePrice: 30000, perMinute: 30000 },
                full: { basePrice: 70000, perMinute: 20000 }
            },
            baseLocationCost: 30000,
            farmService: {
                visit: { price: 150000, features: [] },
                matching: { price: 100000, features: [] },
                full: { price: 200000, features: [] },
                accordion: []
            }
        };
    },
    
    showApiStatus(message, type) {
        const statusEl = document.getElementById('apiStatus');
        if (!statusEl) return;
        
        statusEl.textContent = message;
        statusEl.className = `api-status ${type}`;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusEl.className = 'api-status';
            }, 3000);
        }
    }
};