// ========== photo-service.js ==========
export const PhotoService = {
    priceConfig: null,
    
    init(config) {
        this.priceConfig = config;
        this.setupLocationCards();
    },
    
    setupLocationCards() {
        ['indoor', 'outdoor', 'cooking', 'drone'].forEach(type => {
            this.updateLocationDisplay(type);
        });
    },
    
    updateLocationDisplay(type) {
        if (!this.priceConfig || !this.priceConfig.locations[type]) return;
        
        const config = this.priceConfig.locations[type];
        
        // 기본 가격 표시
        const priceEl = document.getElementById(`${type}-base-price`);
        if (priceEl) {
            priceEl.textContent = this.formatPrice(config.basePrice);
        }
        
        // 기본 제공 정보
        const infoEl = document.getElementById(`${type}-default-info`);
        if (infoEl) {
            infoEl.textContent = `📦 기본 제공: 사진 ${config.basePhoto}매, 영상길이 ${config.baseVideo}분 이상 **(총 재생시간)`;
        }
        
        // 추가 비용 정보
        const photoCostEl = document.getElementById(`${type}-photo-cost`);
        if (photoCostEl) {
            photoCostEl.textContent = `매 (${config.photoAddCost}원/매)`;
        }
        
        const videoCostEl = document.getElementById(`${type}-video-cost`);
        if (videoCostEl) {
            videoCostEl.textContent = `분 (${config.videoAddCost}원/분)`;
        }
    },
    
    formatPrice(price) {
        return price.toLocaleString() + '원';
    }
};